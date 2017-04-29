

/*
  Fetch Api Plyground
*/

var app = (function() {
  'use strict';

  function logResult(result) {
    console.log(result);
  }

  function logError(error) {
    console.log('Looks like there was a problem: \n', error);
  }

  // Check fetch support---if not consider using a polyfill or use XMLHttprequest as a fallback :(
  if (!('fetch' in window)) {
    console.log('Fetch API not found, try including the polyfill');
    return;
  }

  function fetchJSON() {
    fetch('examples/animals.json')
    .then(validateResponse) 
    .then(readResponseAsJSON)
    .then(logResult)
    .catch(logError);
  }
  
  /*
    A promise that resolves to a Response object is returned. If the promise resolves, 
    the response is passed to the next function. 
    If the promise rejects, the catch takes over and the error is passed to the logError function.
  */

  /*
    NOTE: In fetch and promises, bad responses (like 404s) 
    still resolve! A fetch promise only rejects if the request was unable to complete.
    So you must always check the validity of the response.
  */
  
  // This prevents bad responses like (404s) from propagating down the fetch chain.
  function validateResponse(response) {
    
    if (!response.ok) {
      throw Error(response.statusText);
    }
    
    return response;
  }
  
  // Read the response as json --the response object has methods
  function readResponseAsJSON(response) {
    return response.json();
  }

  function showImage(responseAsBlob) {  
    var container = document.getElementById('container');
    var imgElem = document.createElement('img');    
    container.appendChild(imgElem);
    var imgUrl = URL.createObjectURL(responseAsBlob);
    imgElem.src = imgUrl;
}

  function readResponseAsBlob(response) {
    return response.blob();
  }

  function fetchImage() {
    fetch('examples/kitten.jpg')
    .then(validateResponse)
    .then(readResponseAsBlob)
    .then(showImage)
    .catch(logError);
  }

  function showText(responseAsText) {
    var message = document.getElementById('message');
    message.textContent = responseAsText;
  }

  function readResponseAsText(response) {
    return response.text();
  }

  function fetchText() {
    fetch('examples/words.txt')
    .then(validateResponse)
    .then(readResponseAsText)
    .then(showText)
    .catch(logError);
  }


  /* By default, fetch uses the GET method, which retrieves a specific resource. But fetch can also use other HTTP methods*/

  // Head Requests
  function headRequest() {
    fetch('examples/words.txt', {
      method: 'HEAD'
    })
    .then(validateResponse)
    .then(logSize)
    .then(logResult)
    .catch(logError);
  }

  function logSize(response) {
    console.log(response.headers.get('content-length'))
    return response;
  }

  /* NOTE: Never send unencrypted user credentials in production! */

  //Post Request
  function postRequest() {
    
    var formData = new FormData(document.getElementById('myForm'));

    fetch('http://localhost:3000/', {
      method: 'POST',
      body: formData
    })
    .then(validateResponse)
    .then(readResponseAsText)
    .then(logResult)
    .catch(logError);
  }


  /*With custom headers*/

  /*function postRequest() {
    var formData = new FormData(document.getElementById('myForm'));
    fetch('http://localhost:3000/', {
      method: 'POST',
      body: formData,
      mode: 'cors', // This is optional - mode's default value is 'cors'
      headers: customHeaders
    })
    .then(validateResponse)
    .then(readResponseAsText)
    .then(logResult)
    .catch(logError);
  }

  var customHeaders = new Headers({
    'Content-Type': 'text/plain',
    // 'Content-Length': 'kittens' // Content-Length can't be modified!
    'X-Custom': 'hello world',
    // 'Y-Custom': 'this won\'t work' // Y-Custom is not accepted by our echo server!
  });*/


  /*

    'no-cors' and opaque responses:

    If u request a url  using XHR or plain fetch and fail.
    It is because it's a CORS request and the response doesn't have CORS headers.

    However, with fetch, you can make a no-cors request:

    fetch('//google.com', {
      mode: 'no-cors'
    }).then(function(response) {
      console.log(response.type); // "opaque"
    });

    This is similar to the request an <img> makes. Of course, you can't read the content of 
    the response as it could contain private information, but it can be consumed by other APIs:

    self.addEventListener('fetch', function(event) {
      event.respondWith(
        fetch('//www.google.co.uk/images/srpr/logo11w.png', {
          mode: 'no-cors'
        })
      )
    })

    The above is fine within a ServiceWorker, as long as the receiver is happy with a no-cors response.
     <img> is, <img crossorigin> isn't.

  */
  return {
    readResponseAsJSON: (readResponseAsJSON),
    readResponseAsBlob: (readResponseAsBlob),
    readResponseAsText: (readResponseAsText),
    validateResponse: (validateResponse),
    fetchJSON: (fetchJSON),
    fetchImage: (fetchImage),
    fetchText: (fetchText),
    headRequest: (headRequest),
    postRequest: (postRequest)
  };
})();
