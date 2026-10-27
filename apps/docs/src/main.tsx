import React from 'react'
import ReactDOM from 'react-dom/client'
import { DocsApp } from './DocsApp'
import '@furlab/the-lab-sans/the-lab-sans.css'
import './docs.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DocsApp />
  </React.StrictMode>
)
