// LuckyBunny Service Worker
// 页面走 network-first（保证发版后立刻看到新界面），静态资源走 cache-first（保证离线可看）

const CACHE_VERSION = 'v2';
const CACHE_NAME = 'luckybunny-' + CACHE_VERSION;

// 安装时预缓存的核心页面
const PRECACHE = [
    './',
    './index.html',
    './cate.html',
    './cate_bilibili.html',
    './manifest.json',
    './js/httpclient.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // 单个文件缺失不应导致整个 SW 安装失败
            return Promise.all(
                PRECACHE.map((url) => cache.add(url).catch(() => { }))
            );
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    // 只处理同源请求，B 站播放器、图片等保持直连
    if (url.origin !== self.location.origin) return;

    // 页面导航：先走网络，失败再回缓存（避免发版后还看到旧页面）
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request, { ignoreSearch: true })
                    .then((hit) => hit || caches.match('./index.html'))
                )
        );
        return;
    }

    // 静态资源：缓存优先
    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((hit) => {
            if (hit) return hit;
            return fetch(request).then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                return response;
            });
        })
    );
});
