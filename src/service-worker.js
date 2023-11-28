import { manifest, version as CACHE_NAME } from '@parcel/service-worker';
const coreAssets = [
  '/',
  '/directors',
  '/directors/',
  '/movies',
  '/movies/',
  '/error-pages/404',
  '/error-pages/offline'
]
const whitelistSchemes = ['http', 'https'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(manifest))
      .catch(console.error)
  );
});

function cleanResponse(response) {
  if (!(response || 'clone' in response)) {
    return
  }

  const clonedResponse = response.clone();

  const bodyPromise = 'body' in clonedResponse ?
    Promise.resolve(clonedResponse.body) :
    clonedResponse.blob();

  return bodyPromise.then((body) => {
    return new Response(body, {
      headers: clonedResponse.headers,
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
    });
  });
}

function stale_while_revalidate(cacheName, event) {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request)
        .then(cachedResponse => {
          const networkResponse = fetch(event.request)
            .then(networkResponse => {
              if (networkResponse.ok) {
                cache.put(event.request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch(error => {
              console.error(error)
              return cache.match('/error-pages/offline')
                .then(cleanResponse)
            })
          if (cachedResponse) {
            return cleanResponse(cachedResponse)
          }  
          return networkResponse
        })
        .catch(error => {
          console.error('Error in fetch handler:', error);
          throw error;
        })
      ))
}

function offline_first(cacheName, event) {
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => cachedResponse || fetch(event.request)
      .then(response => caches.open(cacheName)
        .then(cache => (cache.put(event.request, response.clone()), response)))))
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  const requestUrl = new URL(request.url);
  const isNavigation = request.mode === 'navigate'
  const isChromeExtensionRequest = requestUrl.protocol === 'chrome-extension:'
  const isRelevantScheme = whitelistSchemes.includes(requestUrl.protocol.replace(':', ''))

  if (isChromeExtensionRequest || !isRelevantScheme) {
    return;
  } else if (isNavigation) {
    stale_while_revalidate(CACHE_NAME, event)
  } else {
    offline_first(CACHE_NAME, event)
  }
})


