/* Schwelmer Kegeltreff – Service Worker: App startet auch ohne Netz.
   App-Seite (index.html): immer zuerst aus dem Netz (frisch, am Zwischenspeicher vorbei).
     Antwortet das Netz nicht innerhalb von 5 s, startet die gespeicherte Version – die frische wird im Hintergrund
     trotzdem fertig geladen und gespeichert, damit beim nächsten Start der neue Stand da ist.
   Versions-Prüfung (?vcheck=…): nur Netz, nie aus dem Speicher – sonst würde die App sich selbst als „aktuell“ melden.
   Bilder & Co.: aus dem Speicher, im Hintergrund aktualisiert. Schriften: einmal geladen, danach aus dem Speicher.
   Vereinsdaten (api.github.com) laufen NICHT hierüber – die verwaltet die App selbst.
   v3: Fehler behoben, durch den beim Öffnen immer die alte gespeicherte Version kam.
   v5: Mitteilungen (Push): anzeigen, Zahl am App-Symbol, Antippen öffnet die richtige Stelle. */
const CACHE = 'kegeltreff-app-v5';
const BADGE = 'kegeltreff-badge';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'logo.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.all(FILES.map(f => fetch(new Request(f, { cache: 'reload' })).then(r => r.ok && c.put(f, r)).catch(() => {}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE && x !== BADGE && x !== 'kegeltreff-fotos').map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
  if (e.data === 'badge0') e.waitUntil(badgeSetzen(0));
});

/* ---------- Mitteilungen ---------- */
async function badgeLesen() { try { const r = await (await caches.open(BADGE)).match('n'); return r ? +(await r.text()) || 0 : 0; } catch (_) { return 0; } }
async function badgeSetzen(n) {
  try { await (await caches.open(BADGE)).put('n', new Response(String(n))); } catch (_) {}
  try { if (n > 0 && self.navigator.setAppBadge) await self.navigator.setAppBadge(n); else if (self.navigator.clearAppBadge) await self.navigator.clearAppBadge(); } catch (_) {}
}
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil((async () => {
    await badgeSetzen((await badgeLesen()) + 1);
    await self.registration.showNotification(d.title || 'Schwelmer Kegeltreff', {
      body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', lang: 'de',
      tag: d.tag || undefined, renotify: !!d.tag, data: { url: d.url || './' }
    });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  const go = new URL(url).searchParams.get('go');
  e.waitUntil((async () => {
    await badgeSetzen(0);
    const list = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) if (c.url.startsWith(self.registration.scope)) { if (go) c.postMessage({ go }); return c.focus(); }
    return clients.openWindow(url);
  })());
});

const frisch = url => fetch(new Request(url, { cache: 'no-store', credentials: 'same-origin' }));

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE), hit = await cache.match(req);
      if (hit) return hit;
      try { const r = await fetch(req); if (r.ok || r.type === 'opaque') cache.put(req, r.clone()); return r; } catch (_) { return Response.error(); }
    })());
    return;
  }
  if (url.origin !== location.origin) return;
  if (url.searchParams.has('vcheck')) { e.respondWith(frisch(url.href)); return; }
  /* Kalenderdatei: die App schickt den Inhalt im Link mit, hier wird daraus eine echte .ics-Datei.
     So öffnet das iPhone direkt „Zum Kalender hinzufügen“ – auch in der App vom Home-Bildschirm. */
  if (url.pathname.endsWith('/kalender.ics') && url.searchParams.has('d')) {
    try {
      const b64 = url.searchParams.get('d').replace(/-/g, '+').replace(/_/g, '/');
      const txt = new TextDecoder().decode(Uint8Array.from(atob(b64), c => c.charCodeAt(0)));
      const name = (url.searchParams.get('n') || 'kegeltreff').replace(/[^a-z0-9-]/gi, '') + '.ics';
      e.respondWith(new Response(txt, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'inline; filename="' + name + '"', 'Cache-Control': 'no-store' } }));
    } catch (_) { e.respondWith(new Response('Kalenderdatei fehlerhaft', { status: 400 })); }
    return;
  }
  if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html')) {
    const netz = caches.open(CACHE).then(cache => frisch(url.origin + url.pathname).then(r => { if (r && r.ok) cache.put('index.html', r.clone()); return r; }));
    e.waitUntil(netz.catch(() => {}));
    e.respondWith((async () => {
      try {
        return await Promise.race([netz, new Promise((_, rej) => setTimeout(() => rej('timeout'), 5000))]);
      } catch (_) {
        const cache = await caches.open(CACHE);
        return (await cache.match('index.html')) || (await cache.match('./')) || netz.catch(() => Response.error());
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const cache = await caches.open(CACHE), hit = await cache.match(req);
    const net = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});
