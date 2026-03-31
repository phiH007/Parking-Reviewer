import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

let theRoot = createRoot(document.getElementById('root'))

theRoot.render(
  <StrictMode>
    <App />
  </StrictMode>
)
