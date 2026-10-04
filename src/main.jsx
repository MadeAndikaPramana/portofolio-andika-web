import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted (no request to Google Fonts before the first paint).
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import '@fontsource-variable/plus-jakarta-sans/wght-italic.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
