import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadTokenFromStorage } from './services/api'

// Load stored API token (if any) so axios has Authorization header
loadTokenFromStorage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Compute scrollbar width and expose as CSS variable to avoid layout shifts
function updateScrollbarSpace() {
  const doc = document.documentElement
  const scrollbarWidth = window.innerWidth - doc.clientWidth
  doc.style.setProperty('--scrollbar-space', (scrollbarWidth > 0 ? scrollbarWidth + 'px' : '0px'))
}

updateScrollbarSpace()
window.addEventListener('resize', updateScrollbarSpace)
