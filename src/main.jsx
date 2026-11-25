import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './admin/Admin.jsx'
import './App.css'
import './refinements.css'
import { ContentProvider } from './admin/Content.jsx'
createRoot(document.getElementById('root')).render(<React.StrictMode>{window.location.pathname.replace(/\/$/, '').endsWith('/admin') ? <Admin /> : <ContentProvider><App /></ContentProvider>}</React.StrictMode>)
