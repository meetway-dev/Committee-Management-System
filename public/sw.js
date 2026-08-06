const CACHE_NAME = "committies-v2";
const PRECACHE_ASSETS = ["/manifest.json"];

// Only cache fingerprinted static assets. HTML navigations can contain
// authenticated, user-specific data and must never be cached or served
// from the cache (that would leak one user's pages to another user).
const SAFE_ASSET = /\.(?:css|js|woff2?|ttf|otf|eot|png|jpe?g|svg|webp|gif|ico)$/i;

const IS_LOCALHOST = self.location && (
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1" ||
  self.location.hostname === "::1"
);

if (!IS_LOCALHOST) {
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS).then(() => self.skipWaiting()))
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

    // Never intercept page navigations. The response is HTML that may
    // contain private per-user data.
    if (event.request.mode === "navigate") return;

    // Never intercept API or auth endpoints.
    if (url.pathname.startsWith("/api/")) return;

    // Only cache safe static assets (e.g. Next.js hashed build files).
    if (!SAFE_ASSET.test(url.pathname)) return;

    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetched = fetch(event.request).then((response) => {
          if (response && response.ok && response.type === "basic") {
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
