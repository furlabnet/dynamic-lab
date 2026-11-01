import '@furlab/the-lab-sans/the-lab-sans.css'
import './playground.css'

import React from 'react'

import ReactDOM from 'react-dom/client'

import { PlaygroundApp } from './Playground'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlaygroundApp />
  </React.StrictMode>
)
