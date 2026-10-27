import React from 'react'
import ReactDOM from 'react-dom/client'
import { SpecimenApp } from './SpecimenApp'
import '@furlab/the-lab-sans/the-lab-sans.css'
import './specimen.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SpecimenApp />
  </React.StrictMode>
)
