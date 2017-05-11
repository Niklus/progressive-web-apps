(function() {
   'use strict';

  	var CACHE_NAME = 'static-cache';

	var urlsToCache = [
	  '.',
	  'index.html',
	  'styles/main.css'
	];

	self.addEventListener('install', function(event) {
	  event.waitUntil(
	    caches.open(CACHE_NAME)
	    .then(function(cache) {
	      return cache.addAll(urlsToCache);
	    })
	  );
	});

    self.addEventListener('fetch', function(event) {
	  event.respondWith(
	    caches.match(event.request)
	    .then(function(response) {
	      return response || fetchAndCache(event.request); // try with justFetch(event.request) and fetchAndCacheAppshell(event.request)
	    })
	  );
	});

	function fetchAndCache(url) {
	  return fetch(url)
	  .then(function(response) {
	    // Check if we received a valid response
	    if (!response.ok) {
	      throw Error(response.statusText);
	    }
	    return caches.open(CACHE_NAME)
	    .then(function(cache) {
	      cache.put(url, response.clone());
	      return response;
	    });
	  })
	  .catch(function(error) {
	    console.log('Request failed:', error);
	    // You could return a custom offline 404 page here
	  });
	}
	
/* ################################################################################## */

    /* Testing some caching Strategies*/

    // if u dont wanna catch dynamically and only rely on the app shell on install
	function justFetch(url) {
	  return fetch(url)
	  .then(function(response) {
	    if (!response.ok) {
	      throw Error(response.statusText);
	    }
	    return response;  
	  })
	  .catch(function(error) {
	    console.log('Request failed:', error);
	  });
	}
    
    // only cache the specified appshell
	function fetchAndCacheAppshell(url) {
	
	// e.g appshell accidentaly deleted by user
	// conditionall catching --- if (url === urlToCache[index]) cache.put(url, response.clone());
	// return response;
	// ensuring we only cache the appshell
	   
	}

})();
