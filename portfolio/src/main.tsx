import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AppProviders from './app/providers'
import './lib/i18n'
import './styles/globals.css'
import './styles/theme.css'
import './styles/home.css'
import './styles/responsive.css'
import './styles/markdown.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProviders>
  </React.StrictMode>,
)
