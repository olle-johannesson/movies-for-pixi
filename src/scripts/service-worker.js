const CACHE_NAME = 'pixi-movies_v1'
const coreAssets = ['']
const whitelistSchemes = ['http', 'https'];

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
  const request = event.request
  const requestUrl = new URL(request.url);
  const isHTMLRequest = request.mode === 'navigate' || request.headers.get('accept').includes('text/html')
  const isChromeExtensionRequest = requestUrl.protocol === 'chrome-extension:'
  const isRelevantScheme = whitelistSchemes.includes(requestUrl.protocol.replace(':', ''))
  
  if (isChromeExtensionRequest || !isRelevantScheme) {
    return;
  }

  if (isHTMLRequest) { 
    // online first
    event.respondWith(fetch(request)
      .then(networkResponse => caches
        .open(CACHE_NAME)
        .then(cache => networkResponse.ok 
            ? (cache.put(request, networkResponse.clone()), networkResponse)
            : Promise.reject('failed to load resource')  
        )
      )
      .catch(() => caches.match(request))
    );
  } else { 
    // offline first
    event.respondWith(caches.match(request)
        .then(cachedResponse => cachedResponse || fetch(request)
          .then(response => caches.open(CACHE_NAME)
            .then(cache => cache.put(request, response.clone()))
            .then(() => response))))
    }
})
