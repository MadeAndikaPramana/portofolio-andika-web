import { useCallback, useEffect, useRef, useState } from 'react'

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`

// Domain-warped noise: reads as slow, thick liquid. Kept dark so text on top stays readable.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.02 + vec2(17.3, 9.1); a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = uTime * 0.045;

  // the pointer pushes the liquid outward
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);
  vec2 d = p - m;
  float r = length(d);
  p += normalize(d + 1e-4) * 0.09 * exp(-r * 3.2);

  vec2 q = vec2(fbm(p * 1.7 + t), fbm(p * 1.7 + vec2(5.2, 1.3) - t));
  vec2 w = vec2(fbm(p * 1.4 + 2.0 * q + vec2(1.7, 9.2) + t * 1.3), fbm(p * 1.4 + 2.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.2 + 2.6 * w);

  vec3 ink  = vec3(0.043, 0.043, 0.047);
  vec3 deep = vec3(0.02, 0.19, 0.16);
  vec3 moss = vec3(0.09, 0.34, 0.2);
  vec3 acid = vec3(0.84, 1.0, 0.25);

  vec3 col = mix(ink, deep, smoothstep(0.2, 0.68, f));
  col = mix(col, moss, smoothstep(0.55, 0.88, f) * 0.75);
  float ridge = smoothstep(0.62, 0.9, f) * smoothstep(0.3, 0.9, length(q));
  col += acid * ridge * 0.34;
  col *= 1.0 - 0.45 * length(uv - 0.5);

  gl_FragColor = vec4(col, 1.0);
}`

function Liquid({ onFail }) {
  const host = useRef(null)

  // The canvas is created here (not in JSX) so every mount gets a fresh WebGL context; React StrictMode
  // mounts effects twice in development, and a context we already released cannot be reused.
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.className = 'absolute inset-0 h-full w-full'
    host.current.appendChild(canvas)
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) {
      canvas.remove()
      onFail()
      return
    }
    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.remove()
      onFail()
      return
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')

    // Smooth liquid needs few pixels: render at about a third of the screen and let CSS scale it up.
    const SCALE = 0.34
    const resize = () => {
      canvas.width = Math.max(2, Math.round(window.innerWidth * SCALE))
      canvas.height = Math.max(2, Math.round(window.innerHeight * SCALE))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const target = { x: 0.5, y: 0.5 }
    const cur = { x: 0.5, y: 0.5 }
    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth
      target.y = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    const t0 = performance.now()
    const frame = (now) => {
      cur.x += (target.x - cur.x) * 0.06
      cur.y += (target.y - cur.y) * 0.06
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - t0) / 1000)
      gl.uniform2f(uMouse, cur.x, cur.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }
  }, [onFail])

  return <div ref={host} aria-hidden="true" className="absolute inset-0" />
}

function Blobs() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="blob -left-[15vmax] -top-[15vmax] h-[70vmax] w-[70vmax]" style={{ background: 'radial-gradient(circle, rgba(215,255,63,0.15) 0%, rgba(215,255,63,0) 62%)', animation: 'drift-a 28s ease-in-out infinite' }} />
      <div className="blob -bottom-[20vmax] -right-[15vmax] h-[80vmax] w-[80vmax]" style={{ background: 'radial-gradient(circle, rgba(37,194,176,0.17) 0%, rgba(37,194,176,0) 62%)', animation: 'drift-b 34s ease-in-out infinite' }} />
      <div className="blob left-[25%] top-[35%] h-[60vmax] w-[60vmax]" style={{ background: 'radial-gradient(circle, rgba(193,39,45,0.13) 0%, rgba(193,39,45,0) 62%)', animation: 'drift-c 31s ease-in-out infinite' }} />
      <div className="blob -right-[10vmax] top-[5%] h-[55vmax] w-[55vmax]" style={{ background: 'radial-gradient(circle, rgba(110,120,255,0.12) 0%, rgba(110,120,255,0) 62%)', animation: 'drift-d 37s ease-in-out infinite' }} />
    </div>
  )
}

// mode: 'auto' | 'blobs' | 'liquid' | 'off'. Auto = liquid on desktop with a mouse, blobs on phones and for reduced motion.
export default function Background({ mode = 'auto' }) {
  const [failed, setFailed] = useState(false)
  const fail = useCallback(() => setFailed(true), [])
  const [capable] = useState(() => {
    if (typeof window === 'undefined') return false
    const desktop = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return desktop && !calm
  })

  const wantLiquid = mode === 'liquid' || (mode === 'auto' && capable)
  const layer = mode === 'off' ? null : wantLiquid && !failed ? <Liquid onFail={fail} /> : <Blobs />

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {layer}
      {mode !== 'off' && <div className="grain absolute inset-0 opacity-[0.07]" />}
    </div>
  )
}

// Only shown with ?bgpreview, for comparing the options.
export function BgSwitch({ mode, setMode }) {
  return (
    <div className="fixed left-3 top-3 z-[90] flex gap-1 rounded-full border border-bone/20 bg-coal/95 p-1 text-xs">
      {['auto', 'liquid', 'blobs', 'off'].map((m) => (
        <button key={m} type="button" onClick={() => setMode(m)} className={`label rounded-full px-3 py-1.5 ${mode === m ? 'bg-acid text-ink' : 'text-bone/80'}`}>
          {m}
        </button>
      ))}
    </div>
  )
}
