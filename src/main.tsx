import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'antd/dist/reset.css'
import 'leaflet/dist/leaflet.css'
import '../assets/style.css'

createRoot(document.getElementById('root')!).render(<App />)

