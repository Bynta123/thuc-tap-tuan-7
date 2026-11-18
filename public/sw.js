/* Service Worker cho Quản lý sản phẩm.
 *
 * Chiến lược:
 *  - Điều hướng (HTML):   network-first, lỗi mạng -> shell "/" đã cache -> offline.html
 *  - Tài nguyên tĩnh:     /assets/* (JS/CSS có hash) cache-first; ảnh/font/manifest stale-while-revalidate
 *  - /api/*:              KHÔNG cache (luôn đi qua mạng) để dữ liệu CRUD không bao giờ bị cũ
 *
 * Khi sửa logic cache, tăng CACHE_VERSION để xóa cache cũ.
 */
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `pm-static-${CACHE_VERSION}`;
const PAGES_CACHE = `pm-pages-${CACHE_VERSION}`;
const PRECACHE_URLS = ['/offline.html', '/favicon.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('pm-') && key !== STATIC_CACHE && key !== PAGES_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function handleNavigation(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      // SPA: mọi route đều trả cùng index.html, nên lưu 1 bản làm "shell" dùng khi offline.
      await cache.put('/', response.clone());
    }
    return response;
  } catch {
    return (await cache.match('/')) || (await caches.match('/offline.html')) || Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  return cached || (await network) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // bỏ qua Google Fonts, CDN...
  if (url.pathname.startsWith('/api/')) return; // không cache API

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (['image', 'font', 'style', 'script'].includes(request.destination) || url.pathname.endsWith('.webmanifest')) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
