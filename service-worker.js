var CACHE = 'remote v4';
var SCOPE = self.registration.scope;

var CACHE_LIST = [
  SCOPE,
  SCOPE + '/app.js',
  SCOPE + '/axios.min.js',
  SCOPE + '/feather.min.js',
  SCOPE + '/index.html',
  SCOPE + '/style.css',
];

self.addEventListener('install', (evt) => {
  console.log('The service worker is being installed.');

  // Precache and clean up old caches
  evt.waitUntil(precache());
  evt.waitUntil(cleanup());
});

// Cache most parts, but fetch from network if not availible locally
self.addEventListener('fetch', (evt) => {
  let request = evt.request;

  evt.respondWith(
    caches.match(request).then((matching) => {
      // Always try to grab newer versions of cached files, but do not block
      if (matching) {
        fetch(request).then(function (response) {
          caches.open(CACHE).then((cache) => {
            cache.put(request, response);
          });
        });
      }

      // Serve the cached match immediately or grab from network
      return matching || fetch(request);
    })
  );
});

function precache() {
  return caches.open(CACHE).then((cache) => {
    return cache.addAll(CACHE_LIST);
  });
}

// Wipe no longer useful caches
function cleanup() {
  return caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames
        .filter((cacheName) => {
          return cacheName !== CACHE;
        })
        .map((cacheName) => {
          console.log('Deleting old service worker cache', cacheName);
          return caches.delete(cacheName);
        })
    );
  });
}
