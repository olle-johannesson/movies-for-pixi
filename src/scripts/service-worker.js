const CACHE_NAME = 'pixi-movies_v1'
const coreAssets = [
  ''
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(coreAssets))
  );
});

/**
 * HTML requests are the basis of all other requests on this site,
 * so they should be served fresh if possible.
 * Otherwise, revert to cached results.
 * 
 * Since parcel will add content-hashes to the file names, we can
 * just cache everything else.
 */
self.addEventListener('fetch', (event) => {
  const isHTMLRequest = event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')
  if (isHTMLRequest) { 
    // online first
    event.respondWith(fetch(event.request)
      .then(networkResponse => caches
        .open(CACHE_NAME)
        .then(cache => networkResponse.ok 
            ? (cache.put(event.request, networkResponse.clone()), networkResponse)
            : Promise.reject('failed to load resource')  
        )
      )
      .catch(() => caches.match(event.request))
    );
  } else { 
    // offline first
    event.respondWith(caches.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request)
          .then(response => caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, response.clone()))
            .then(() => response))))
    }
})
