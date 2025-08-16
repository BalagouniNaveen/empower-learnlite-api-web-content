self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("learnlite-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.webmanifest"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          new Response("You are offline", { status: 503 })
        )
      );
    })
  );
});
