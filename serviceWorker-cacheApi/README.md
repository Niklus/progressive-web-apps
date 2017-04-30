# Cache API 

The Cache interface, that lets you create stores of responses keyed by request. 
Normaly intended for service workers but can be accessed from anywhere in your scripts.

Entry point is caches --collection of Cache Objects

## Resource Storage 

* On service worker install: Cache the application Shell - (HTML,CSS, JS) 

* On User interaction: A user can be given an option select the content they want available offline if the whole site cant be taken offline -read later, save etc

* On Network Response: If a request doesn't match anything in the cache, get it from the network, send it to the page and add it to the cache at the same time.

## Serving files from the cache approaches

* Cache only
* Network only
* Cache falling back to network --popular
* Network falling back to cache 
* cache then network --popular
* Generic fallback --no network and no cache ? no problem ! => offline.html page
