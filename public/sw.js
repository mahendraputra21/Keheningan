const CACHE = "keheningan-v1";
const CORE = ["/", "/game", "/manifest.json", "/enzo.png"];
const LANDING = ["/landing/enso.png", "/landing/hero-landscape.jpg"];
const AUDIO = [
  "/audio/forest-wind-and-birds.mp3",
  "/audio/daytime.mp3",
  "/audio/bird-singing.mp3",
  "/audio/river-zen-flow.mp3",
  "/audio/wind-bamboo-blowing.mp3",
];

self.addEventListener("install", (e) => {
  // @ts-ignore
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      try { await c.addAll(CORE); } catch {}
      try { await c.addAll(LANDING); } catch {}
      // cache audio best-effort (large files may fail offline-first install)
      for (const u of AUDIO) {
        try { await c.add(u); } catch {}
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  // @ts-ignore
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // @ts-ignore
  const req = e.request;
  const url = new URL(req.url);
  const isAudio = url.pathname.startsWith("/audio/");
  const isGet = req.method === "GET";
  // @ts-ignore
  if (isAudio && isGet) {
    // cache-first for audio, store network response
    e.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => cached);
      })
    );
    return;
  }
  // @ts-ignore
  e.respondWith(
    caches.match(req).then((r) => {
      if (r) return r;
      return fetch(req)
        .then((res) => {
          // runtime cache for same-origin GET
          if (isGet && url.origin === self.location.origin && res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => r);
    })
  );
});
