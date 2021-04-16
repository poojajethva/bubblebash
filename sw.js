const staticCache = "static-cache-v1";
const assets = [
    "/",
    "/index.html",
    "/js/app.js",
    "/js/index.js",
    "/style.css",
    "/img/subject.png",
    "/img/bubble.png"
];
//install event
self.addEventListener('install', (evt) => {
    evt.waitUntill(
        caches.open(staticCache).then(cache => {
            console.log("caching");
            cache.addAll(assets);
        })
        )
    })
    
    //activate event
    self.addEventListener('activate', (evt) => {
        // console.log("sw activated");
        evt.waitUntil(
            caches.keys().then(keys => {
              //console.log(keys);
              return Promise.all(keys
                .filter(key => key !== staticCache)
                .map(key => caches.delete(key))
              );
            })
          );
    })
    
    //fetch event
    self.addEventListener('fetch', (evt) => {
        console.log("sw fetchd");
        evt.respondWith(caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        }))
    })