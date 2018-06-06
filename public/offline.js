const CACHE_NAME = 'prdc'
// Version 0.6.5
self.addEventListener('install', e => {
    console.log('installing service worker!!')
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/json/data.json`,
        `/static/js/bundle.js`
      ])
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
    console.log('activating service worker');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    console.log(`fetching ${event.request.url}`)
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});