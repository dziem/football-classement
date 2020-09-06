importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
	{ url: '/index.html', revision: '1' },
	{ url: '/standing.html', revision: '1' },
	{ url: '/team-detail.html', revision: '1' },
	{ url: '/css/materialize.min.css', revision: '1' },
	{ url: '/css/style.css', revision: '1' },
	{ url: '/js/materialize.min.js', revision: '1' },
	{ url: '/js/idb.js', revision: '1' },
	{ url: '/js/db.js', revision: '1' },
	{ url: '/js/api.js', revision: '1' },
	{ url: '/sw-reg.js', revision: '1' },
	{ url: '/notif-reg.js', revision: '1' },
	{ url: '/manifest.json', revision: '1' },
	{ url: '/icon.png', revision: '1' },
	{ url: '/icon-small.png', revision: '1' }
], {
  ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  new RegExp('/standing.html'),
  workbox.strategies.staleWhileRevalidate({
	  cacheName: 'standing'
  })
);

workbox.routing.registerRoute(
  new RegExp('/team-detail.html'),
  workbox.strategies.staleWhileRevalidate({
	  cacheName: 'team-detail'
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-data',
	plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
	body = event.data.text();
  } else {
	body = 'Push message no payload';
  }
  var options = {
	body: body,
	vibrate: [100, 50, 100],
	data: {
	  dateOfArrival: Date.now(),
	  primaryKey: 1
	}
  };
  event.waitUntil(
	self.registration.showNotification('Push Notification', options)
  );
});