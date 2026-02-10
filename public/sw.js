const CACHE_NAME = 'keter-v1.0.0'
const STATIC_CACHE = 'keter-static-v1.0.0'
const DYNAMIC_CACHE = 'keter-dynamic-v1.0.0'

// Arquivos para cachear imediatamente
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg'
]

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  
  self.skipWaiting()
})

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...')
  
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('[SW] Removing old cache:', key)
            return caches.delete(key)
          })
      )
    })
  )
  
  return self.clients.claim()
})

// Estratégia de cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignora chrome extensions e outros protocolos
  if (!url.protocol.startsWith('http')) return

  // Network-first para API calls
  if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Cache-first para assets estáticos
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script'
  ) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Network-first para o resto
  event.respondWith(networkFirst(request))
})

// Cache-first strategy
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    const cache = await caches.open(DYNAMIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    console.error('[SW] Fetch failed:', error)
    // Retornar página offline se disponível
    return caches.match('/offline.html')
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(DYNAMIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    throw error
  }
}
