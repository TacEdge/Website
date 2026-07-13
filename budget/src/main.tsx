import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/play/400.css'
import '@fontsource/play/700.css'
import '@fontsource/be-vietnam-pro/300.css'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
