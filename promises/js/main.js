
/*Promises*/

var app = (function() {

  function getImageName(country) {
    
    country = country.toLowerCase();

    // Create a promise
    var promiseOfImageName = new Promise(function(resolve, reject) {
      setTimeout(function() {
        if (country === 'spain' || country === 'chile' || country === 'peru') {
          resolve(country + '.png');
        } else {
          reject(Error('Didn\'t receive a valid country name!'));
        }
      }, 1000);
    });
    
    console.log(promiseOfImageName);
    
    return promiseOfImageName;
  }

  function isSpain(country) {
    return new Promise(function(resolve, reject){
      if(country == "Spain"){
        resolve('Spain')
      }else{
        reject(Error('not Spain'))
      }
    });
  }

  function chain(country) {
    return getImageName(country)
    .then(logSuccess)  // A callback can be used here for rejected cases e.g .then(logSuccess,logError) but using catch is better for error handling
    .catch(logError); // Deals only with rejected cases
  }



  /*  
    Because catch returns a promise, you can use the catch method 
    inside a promise chain to recover from earlier failed operations. 
  */
  function flagChain(country) {
    return getImageName(country)
    .catch(fallbackName) // will resolve to kenya.png if promise rejected
    .then(fetchFlag)
    .then(processFlag)
    .then(appendFlag)
    .catch(logError);
  }


  function spainTest(country) {
    return isSpain(country)
    .then(returnTrue)
    .catch(returnFalse)  
  }


  /*
    Promise.all returns a promise that resolves if all of the promises passed into it resolve. 
    If any of the passed-in promises reject, then Promise.all rejects. 
    Useful for ensuring that a group of asynchronous actions complete
  */

  function allFlags(promiseList) {
    return Promise.all(promiseList)
    .catch(returnFalse);
  }

  var promises = [
    getImageName('Spain'),
    getImageName('Chile'),
    getImageName('Peru')
  ];

  allFlags(promises).then(function(result) {
    console.log(result);
  });



  /*
   Promise.race takes a list of promises and settles as soon as the first promise in the list settles. 
   If the first promise resolves, Promise.race resolves with the corresponding value, 
   if the first promise rejects, Promise.race rejects with the corresponding reason.
   Use with Caution: if the first promise rejects then it cant resolve later if the another promise resolves
  */
 
  var promise1 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, 'one');
  });

  var promise2 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, 'two');
  });

  Promise.race([promise1, promise2])
  .then(logSuccess)
  .catch(logError);

  /* Helper functions */

  function logSuccess(result) {
    console.log('Success!:\n' + result);
  }

  function logError(err) {
    console.log('Oh no!:\n' + err);
  }

  function returnTrue() {
    return true;
  }

  function returnFalse() {
    return false;
  }

  function fetchFlag(imageName) {
    return fetch('flags/' + imageName); // fetch returns a promise
  }

  function processFlag(flagResponse) {
    if (!flagResponse.ok) {
      throw Error('Bad response for flag request!'); // This will implicitly reject
    }
    return flagResponse.blob(); // blob() returns a promise
  }

  function appendFlag(flagBlob) {
    var flagImage = document.createElement('img');
    var flagDataURL = URL.createObjectURL(flagBlob);
    flagImage.src = flagDataURL;
    document.body.appendChild(flagImage);
  }

  function fallbackName() {
    return 'kenya.png';
  }
  
  return {
    getImageName: (getImageName),
    flagChain: (flagChain),
    isSpain: (isSpain),
    spainTest: (spainTest),
    fetchFlag: (fetchFlag),
    processFlag: (processFlag),
    appendFlag: (appendFlag),
    allFlags: (allFlags)
  };

})();
