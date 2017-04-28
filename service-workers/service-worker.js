/*
 	A Simple Service Worker
*/

(function() {
  'use strict';
    
    // 1. Installation
 	self.addEventListener('install', function(event) {
  		console.log('Service worker installing...');
  	 	self.skipWaiting(); // allows a service worker to activate as soon as it finishes installation
	});
    
    // 2. Activation
	self.addEventListener('activate', function(event) {
	  console.log('Service worker activating...');
	});

	// 3. Intercept Network Request
	self.addEventListener('fetch', function(event) {
		console.log('Fetching:', event.request.url);
	});


	/*	
		After initial installation and activation, re-registering an existing worker 
 		does not re-install or re-activate the service worker.
 		If the browser detects a new service worker (byte difference from the existing service worker
 		file), then the new service worker is installed.
 	*/

 	/*
		Since only one service worker can be active at a time (for a given scope), 
		even though the new service worker is installed, it isn't activated until the existing service worker is no longer in use. 
		By closing all pages under the old service worker's control, we are able to activate the new service worker.

		BUUUUT It is possible for a new service worker to activate immediately using self.skipWaiting() as shown above
 	*/

 	/*
		The service worker receives a fetch event for every HTTP request made by the browser. 
		The fetch event object contains the request.
		By default, fetch events from a page won't go through a service worker 
		unless the page request itself went through a service worker. 
 	*/


})();
