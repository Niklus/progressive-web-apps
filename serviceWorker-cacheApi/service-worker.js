
(function() {
  'use strict';


  // Define the files to cache: Application Shell
	var filesToCache = [
		'.',
		'style/main.css',
		'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
		'images/still_life-1600_large_2x.jpg',
		'images/still_life-800_large_1x.jpg',
		'images/still_life_small.jpg',
		'images/still_life_medium.jpg',
		'index.html',
		'pages/offline.html',
		'pages/404.html'
	];

	/*  
	  Here we Leave out some resources, that will be added 
	  to the cache as they are requested. What is important to cache
	  upfront is dependent on your app.
	*/

  
  // Define the cahce name
	var staticCacheName = 'pages-cache-v2';
  
  // Install service worker and cache the static assets
	self.addEventListener('install', function(event) {
	  
	  console.log('Attempting to install service worker and cache static assets');
	  
	  event.waitUntil(
	  	// Create the cache
	    caches.open(staticCacheName) 
	    .then(function(cache) {
	    	// add files to the cache
	      return cache.addAll(filesToCache); 
	    })
	  );
	  /* 
		We wrap this in event.waitUntil to extend the lifetime of the event 
		until all of the files are added to the cache and addAll resolves successfully.
	  */
	});

  /* 
  	Intercept requests and serve from the cache if available
  	Using the "cache falling to network" strategy
  */
  self.addEventListener('fetch', function(event) {
    
    console.log('Fetch event for ', event.request.url);
    
    event.respondWith(
      
      caches.match(event.request).then(function(response) {
        
        
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }

        //If no response make a network request
        console.log('Network request for ', event.request.url);
        
        return fetch(event.request).then(function(response) {
          
          // Respond with custom 404 page if status 404
          if (response.status === 404) {
            return caches.match('pages/404.html');
          }
           
          // Add resources to the cache as they are requested 
          return caches.open(staticCacheName).then(function(cache) {
          	
            cache.put(event.request.url, response.clone());
            return response;

            /* 
		      Here we can conditionally add resources.
			  In some cases you might not want to cache url/resources
			  e.g if (event.request.url meets some condition) cache.put(event.request.url, response.clone());
            */
          });
        });
      }).catch(function(error) {

      	// Respond with a custom offline page if network fails
      	// If fetch cannot reach the network, it throws an error and sends it to a .catch
        console.log('Error, ', error);
        return caches.match('pages/offline.html');
      })
    );
  });


  /* 
  	Delete unused caches
    By Changing the cachename e.g to pages-cache-v3 
    we can delete the old cache
  */

  self.addEventListener('activate', function(event) {
	  
	  console.log('Activating new service worker...');

	  var cacheWhitelist = [staticCacheName];

	  event.waitUntil(
	    caches.keys().then(function(cacheNames) {
	      return Promise.all(
	        cacheNames.map(function(cacheName) {
	          if (cacheWhitelist.indexOf(cacheName) === -1) {
	            return caches.delete(cacheName);
	          }
	        })
	      );
	    })
	  );
	});
	/*
		We delete old caches in the activate event to make sure that we aren't 
	  deleting caches before the new service worker has taken over the page. 
		We create an array of caches that are currently in use and delete all other caches.
	*/

})();
