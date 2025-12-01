self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("flappy-baby-cache").then(cache =>
      cache.addAll([
        "./",
        "index.html",
        "style.css",
        "game.js",
        "assets/baby.png",
        "assets/millie.png",
        "assets/gameover.png"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
