import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import { reportWebVitals } from '@/lib/vitals'
import '@/styles/index.css'

// Initialize Sentry for error monitoring
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    beforeSend(event, hint) {
      if (import.meta.env.DEV && window.location.hostname === 'localhost') {
        return null
      }
      return event
    },
  })
  console.log('✅ Sentry initialized for error monitoring')
} else {
  console.log('ℹ️ Sentry DSN not configured - error monitoring disabled')
}

// Registrar Service Worker
const SW_UPDATE_INTERVAL = 1000 * 60 * 60 // 1 hora

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration)
        
        // Verificar atualizações a cada 1 hora
        setInterval(() => {
          registration.update()
        }, SW_UPDATE_INTERVAL)
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

// Report Web Vitals in production
if (import.meta.env.PROD) {
  reportWebVitals()
}
