import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './showcase.css'

// The Lab Sans. Set VITE_THE_LAB_SANS=off to fall back to the system font; the font files are
// then left out of the bundle entirely.
if (import.meta.env.VITE_THE_LAB_SANS !== 'off') import('@furlab/the-lab-sans/the-lab-sans.css')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
