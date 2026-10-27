import React from 'react'
import ReactDOM from 'react-dom/client'
import { LandingApp } from './LandingApp'
import '@furlab/the-lab-sans/the-lab-sans.css'
import './landing.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LandingApp />
  </React.StrictMode>
)
