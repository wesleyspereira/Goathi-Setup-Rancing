import React from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Admin from './admin/Admin.jsx'
createRoot(document.getElementById('root')).render(<React.StrictMode><Admin/></React.StrictMode>)
