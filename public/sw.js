// Service Worker for HYPEYA Miniapp - Production Optimized
// Handles caching, offline functionality, and performance optimization

const CACHE_NAME = "hypeya-miniapp-v1.0.0";
const STATIC_CACHE = "hypeya-static-v1.0.0";
const API_CACHE = "hypeya-api-v1.0.0";

// Assets to cache immediately (production optimized)
const STATIC_ASSETS = [
  "/",
  "/search",
  "/offline",
  "/images/hypeya-logo.png",
  "/icon-192x192.png",
  "/manifest.json",
];

// WordPress API patterns to cache (for future API pattern matching)
const API_CACHE_PATTERNS = [/^https:\/\/hypeya\.xyz\/wp-json\/wp\/v2\//];

// Helper function to check if URL matches API patterns
function isApiRequest(url) {
  return API_CACHE_PATTERNS.some((pattern) => pattern.test(url));
}

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE).then(() => {
        console.log("[SW] Initializing API cache");
        return Promise.resolve();
      }),
    ])
  );

  // Force activation
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== STATIC_CACHE &&
            cacheName !== API_CACHE
          ) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control immediately
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip Chrome extensions
  if (url.protocol === "chrome-extension:") return;

  // Different strategies for different types of requests
  if (url.pathname.startsWith("/api/") || isApiRequest(request.url)) {
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(handleStaticAssets(request));
  } else if (url.pathname.startsWith("/_next/image")) {
    event.respondWith(handleImages(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests with Network First strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);

  try {
    // Try network first
    const response = await fetch(request);

    if (response.ok) {
      // Cache successful responses
      cache.put(request, response.clone());
      console.log("[SW] Cached API response:", request.url);
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    const cached = await cache.match(request);

    if (cached) {
      console.log("[SW] Serving API from cache:", request.url);
      return cached;
    }

    // Return offline response for articles
    if (request.url.includes("/api/articles")) {
      return new Response(
        JSON.stringify({
          data: [],
          message: "Offline - no cached data available",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    throw error;
  }
}

// Handle static assets with Cache First strategy
async function handleStaticAssets(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    console.log("[SW] Serving static asset from cache:", request.url);
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log("[SW] Failed to fetch static asset:", request.url);
    throw error;
  }
}

// Handle images with Cache First strategy
async function handleImages(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      // Only cache images that are not too large
      const contentLength = response.headers.get("content-length");
      const size = contentLength ? parseInt(contentLength) : 0;

      if (size < 2 * 1024 * 1024) {
        // 2MB limit
        cache.put(request, response.clone());
      }
    }

    return response;
  } catch {
    // Return a placeholder image for offline
    return new Response("", {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}

// Handle page requests with Stale While Revalidate
async function handlePageRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  // Always fetch in background
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  // Return cached version if available, otherwise wait for network
  if (cached) {
    console.log("[SW] Serving page from cache:", request.url);
    void fetchPromise; // Update cache in background
    return cached;
  }

  try {
    return await fetchPromise;
  } catch {
    // Return offline page
    const offlineResponse = await cache.match("/offline");
    return (
      offlineResponse ||
      new Response(
        "<html><body><h1>Offline</h1><p>Please check your connection.</p></body></html>",
        { headers: { "Content-Type": "text/html" } }
      )
    );
  }
}

// Background sync for when connection is restored
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === "sync-articles") {
    event.waitUntil(syncArticles());
  }
});

async function syncArticles() {
  try {
    // Fetch latest articles and update cache
    const response = await fetch("/api/articles");

    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put("/api/articles", response.clone());
      console.log("[SW] Articles synced in background");
    }
  } catch (error) {
    console.log("[SW] Background sync failed:", error);
  }
}

// Push notifications (for future use)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    tag: "article-notification",
    renotify: true,
    actions: [
      { action: "open", title: "Read Article" },
      { action: "close", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
  }
});

// Periodic background sync (for supported browsers)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "refresh-articles") {
    event.waitUntil(syncArticles());
  }
});

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      break;

    case "CACHE_ARTICLE":
      handleCacheArticle(payload);
      break;

    case "GET_CACHE_STATUS":
      handleGetCacheStatus(event);
      break;

    default:
      console.log("[SW] Unknown message type:", type);
  }
});

async function handleCacheArticle(articleData) {
  try {
    const cache = await caches.open(API_CACHE);
    const response = new Response(JSON.stringify(articleData), {
      headers: { "Content-Type": "application/json" },
    });

    await cache.put(`/api/articles/${articleData.id}`, response);
    console.log("[SW] Article cached:", articleData.id);
  } catch (error) {
    console.error("[SW] Failed to cache article:", error);
  }
}

async function handleGetCacheStatus(event) {
  try {
    const [staticCache, apiCache, pageCache] = await Promise.all([
      caches.open(STATIC_CACHE),
      caches.open(API_CACHE),
      caches.open(CACHE_NAME),
    ]);

    const [staticKeys, apiKeys, pageKeys] = await Promise.all([
      staticCache.keys(),
      apiCache.keys(),
      pageCache.keys(),
    ]);

    event.ports[0].postMessage({
      static: staticKeys.length,
      api: apiKeys.length,
      pages: pageKeys.length,
      total: staticKeys.length + apiKeys.length + pageKeys.length,
    });
  } catch (error) {
    event.ports[0].postMessage({ error: error.message });
  }
}
