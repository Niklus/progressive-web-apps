## Service Worker

A JavaScript file that runs separately from the main browser thread, enablíng applications to control network requests, cache those requests to improve performance, and provide offline access to cached content.

### Featues

* Intercepts network requests
* Caches or retrieves resources from the [Cache]('https://developer.mozilla.org/en-US/docs/Web/API/Cache')
* Recieve push messages from the server
* Asynchronous: no XHR or localstorage -- use [fetch]('https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API') and [indexedDb]('https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API')
* No direct dom access -- use [postMesage()]('https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage')
* Secure: Only run over HTTPS

### Service Worker Lifecycle

* Resgistration
* Installation
* Activation

### Events

* **install**
* **activate** 
* **message** events from otherr scripts
* functional events: **push**, **fetch** and **sync**

### A base for Advanced Features

* Notifications API
* Push Api
* Background Sync 
* Channel messaging


