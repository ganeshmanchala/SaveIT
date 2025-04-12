import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Components/AuthContext.jsx'

import { SearchProvider } from './Components/SearchContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchProvider>  
    <AuthProvider>
    <App />
    </AuthProvider>
    </SearchProvider>  
  </StrictMode>,
)
