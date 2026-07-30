const CACHE_NAME = "committies-v1";
const STATIC_ASSETS = [
  "/manifest.json"
];

const IS_LOCALHOST = self.location && (
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1" ||
  self.location.hostname === "::1"
);

if (!IS_LOCALHOST) {
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).then(() => self.skipWaiting()))
    );
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      ).then(() => self.clients.claim())
    );
  });

  self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith("/api/")) return;

    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetched = fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        }).catch(() => cached);

        return cached || fetched;
      })
    );
  });
} else {
  // On localhost/dev, avoid caching and heavy fetch handling so dev HMR and turbopack assets aren't intercepted.
  // Unregister this service worker when activated so it stops controlling dev clients.
  self.addEventListener("install", (e) => e.waitUntil(self.skipWaiting()));
  self.addEventListener("activate", (e) => {
    e.waitUntil((async () => {
      try { await self.registration.unregister(); } catch (err) {}
      await self.clients.claim();
    })());
  });
}
