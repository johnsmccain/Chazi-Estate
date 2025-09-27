const CACHE_NAME = 'chazi-chain-v1';
const STATIC_CACHE = 'chazi-chain-static-v1';
const DYNAMIC_CACHE = 'chazi-chain-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/health/,
  /\/api\/test/,
  /\/api\/property/,
  /\/api\/auth/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(error => {
          console.warn('Service Worker: Failed to cache some assets:', error);
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests with cache-first strategy
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('Service Worker: Serving API from cache:', url.pathname);
                return cachedResponse;
              }

              return fetch(request)
                .then((networkResponse) => {
                  // Cache successful responses
                  if (networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone());
                    console.log('Service Worker: Caching API response:', url.pathname);
                  }
                  return networkResponse;
                })
                .catch(() => {
                  // Return offline fallback for API requests
                  return new Response(
                    JSON.stringify({ 
                      error: 'Offline', 
                      message: 'You are offline. Please check your connection.' 
                    }),
                    { 
                      status: 503, 
                      headers: { 'Content-Type': 'application/json' } 
                    }
                  );
                });
            });
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Service Worker: Serving static asset from cache:', url.pathname);
            return cachedResponse;
          }

          return fetch(request)
            .then((networkResponse) => {
              // Cache successful responses
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                    console.log('Service Worker: Caching static asset:', url.pathname);
                  });
              }
              return networkResponse;
            })
            .catch(() => {
              // Return offline page for navigation requests
              if (request.mode === 'navigate') {
                return caches.match('/index.html');
              }
            });
        })
    );
    return;
  }

  // Handle external resources with network-first strategy
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache external resources
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return networkResponse;
      })
      .catch(() => {
        // Try to serve from cache if network fails
        return caches.match(request);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline actions when connection is restored
      handleBackgroundSync()
    );
  }
});

async function handleBackgroundSync() {
  try {
    // Get offline actions from IndexedDB
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        // Remove successful action from offline queue
        await removeOfflineAction(action.id);
        console.log('Service Worker: Synced offline action:', action.id);
      } catch (error) {
        console.log('Service Worker: Failed to sync action:', action.id, error);
      }
    }
  } catch (error) {
    console.log('Service Worker: Background sync failed:', error);
  }
}

// Helper functions for offline actions
async function getOfflineActions() {
  // This would integrate with IndexedDB
  // For now, return empty array
  return [];
}

async function removeOfflineAction(actionId) {
  // This would remove from IndexedDB
  // For now, just log
  console.log('Service Worker: Removing offline action:', actionId);
}
