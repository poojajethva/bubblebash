const staticCache = "static-cache-v13";
const assets = [
    "../bubblebash/",
    "../bubblebash/index.html",
    "../bubblebash/js/app.js",
    "../bubblebash/js/index.js",
    "../bubblebash/style.css",
    "../bubblebash/img/subject.png",
    "../bubblebash/img/bubble.png"
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