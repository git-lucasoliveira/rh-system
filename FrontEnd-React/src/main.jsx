import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css' // <--- MUDOU AQUI (Adicionamos /styles/)
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)