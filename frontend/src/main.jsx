import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './components/ThemeContext.jsx' // 1. Import the provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap the whole App inside ThemeProvider */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
