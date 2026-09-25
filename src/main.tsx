import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './assets/styles/index.css'

async function enableMocks() {
  const { worker } = await import('./workers/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
    quiet: true
  })
}

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

enableMocks().then(() => {
  createRoot(container).render(
      <App />
  )
})
