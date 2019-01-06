var CACHE = 'remote v1';

var CACHE_LIST = [
    '/app.js',
    '/index.html',
    '/style.css'
];

self.addEventListener('install', evt => {
    console.log('The service worker is being installed.');

    // Precache and clean up old caches
    evt.waitUntil(precache());
    eval.waitUntil(cleanup());
});

// Cache most parts, but fetch from network if not availible locally
self.addEventListener('fetch', evt => {
    let request = evt.request;

    evt.respondWith(
        caches.match(request).then(matching => {
            return matching || fetch(request);
        })
    );
});

function precache() {
    return caches.open(CACHE).then(cache => {
        return cache.addAll(CACHE_LIST);
    });
}

// Wipe no longer useful caches
function cleanup() {
    return caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.filter(cacheName => {
                return cacheName !== CACHE;
            }).map(cacheName => {
                console.log("Deleting old service worker cache", cacheName);
                return caches.delete(cacheName);
            })
        );
    });
}