/**
 * sw.js - 소모품 관리 시스템 Service Worker v2.0
 *
 * 캐시 전략:
 *  - 정적 파일 (HTML/manifest): Cache First → 오프라인 접근 가능
 *  - Supabase API:              Network Only → 항상 최신 데이터
 *  - CDN (Tailwind, Supabase SDK): Stale-While-Revalidate
 */

const CACHE_VER  = 'v2.0';
const CACHE_NAME = 'consumable-mgr-' + CACHE_VER;

const STATIC_FILES = [
  './index.html',
  './manifest.json'
];

const CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net'
];

// ───────────────────────────────────────────
// Install: 정적 파일 사전 캐시
// ───────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] 설치:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

// ───────────────────────────────────────────
// Activate: 구버전 캐시 정리
// ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] 활성화');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('consumable-mgr-') && k !== CACHE_NAME)
          .map((k) => { console.log('[SW] 구버전 삭제:', k); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
  );
});

// ───────────────────────────────────────────
// Fetch: 요청 유형별 전략 분기
// ───────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Supabase API → Network Only
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(
          JSON.stringify({ error: '오프라인입니다. 인터넷 연결을 확인해주세요.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    return;
  }

  // 2. CDN → Stale While Revalidate
  if (CDN_HOSTS.some((h) => url.hostname.includes(h))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          const fresh = fetch(event.request).then((res) => {
            if (res && res.status === 200) cache.put(event.request, res.clone());
            return res;
          });
          return cached || fresh;
        })
      )
    );
    return;
  }

  // 3. 정적 파일 → Cache First
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (!res || res.status !== 200 || res.type !== 'basic') return res;
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          return res;
        }).catch(() => caches.match('./index.html'));
      })
    );
  }
});

// ───────────────────────────────────────────
// Message: 앱 → SW 통신
// ───────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VER });
  }
});
