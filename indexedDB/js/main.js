var idbApp = (function() {
  'use strict';

  // Check for support
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }
  
  /*
  1.  Opening a database:
    idb.open takes a database name, version number, and optional callback function 
    for performing database updates. 
    The version number determines whether the upgrade callback function is called. 
    If the version number is greater than the version number of the database existing 
    in the browser, then the upgrade callback is executed.
  */

  // var dbPromise = idb.open('couches-n-things', 1);

  // Open a database and Create an object store
  var dbPromise = idb.open('couches-n-things', 1, function(upgradeDb) {
    
    switch (upgradeDb.oldVersion) {
    case 0:
      // a placeholder case so that the switch block will 
      // execute when the database is first created
      // (oldVersion is 0)
    case 1:
      console.log('Creating the products object store');
      upgradeDb.createObjectStore('products', {keyPath: 'id'});
    case 2:
      console.log('Creating a name index');
      var store = upgradeDb.transaction.objectStore('products');
      store.createIndex('name', 'name', {unique: true});
    case 3:
      console.log('Creating a price and description index');
      var store = upgradeDb.transaction.objectStore('products');
      store.createIndex('price', 'price');
      store.createIndex('description', 'description');
    case 4:
      console.log('Creating the orders object store');
      upgradeDb.createObjectStore('orders', {keyPath: 'id'});
  }
});
/*
 To ensure database integrity, object stores and indexes can only be created during database upgrades. 
 This means they are created inside the upgrade callback function in idb.open, which executes only if the 
 version number (in this case it's 2) is greater than the existing version in the browser or if the database doesn't exist. 
 The callback is passed the UpgradeDB object (see the documentation for details), which is used to create the object stores.
*/



  /*
    2. Adding Items to an object store
  */

  function getItems(path){
    return fetch(path)
    .then(function(res){
      return res.json();
    }).then(function(res){
      return res;
    }).catch(function(err){
      console.log('Error:', err);
    });
  }

  function addProducts() {
    getItems('items/items.json')
    .then(addToStore);
  }

  function addToStore(items){
    dbPromise.then(function(db) {  
      var tx = db.transaction('products', 'readwrite');
      var store = tx.objectStore('products');   
      items.forEach(function(item) {
        console.log('Adding item: ', item);
        store.add(item);
      });
      return tx.complete;
    }).then(function() {
      console.log('All items added successfully!');
    }).catch(function(e) {
      console.log('Error adding items: ', e);
    });
  }
  /*
    All database operations must be carried out within a transaction. 
    The transaction rolls back any changes to the database if any of the operations fail. 
    This ensures the database is not left in a partially updated state.
  */

  /*
    'readrite' transactions include:  put, add, or delete 
    someObjectStore.add(data, optionalKey);
    someObjectStore.put(data, optionalKey);
    someObjectStore.delete(primaryKey);

  */
  

  /*
    3. Retrieve an item by its properties
  */
  
  // By ID
  function getById(primKey) {
    return dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readonly');
      var store = tx.objectStore('products');
      return store.get(primKey);
    });
  }
  
  //By name
  function getByName(key) {
    return dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readonly');
      var store = tx.objectStore('products');
      var index = store.index('name'); // We use index to retrieve.
      return index.get(key);
    });
  }

  function displayByName() {
    var key = document.getElementById('name').value; 
    if (key === '') {return;}
    var s = '';
    getByName(key).then(function(object) {
      if (!object) {return;}
      s += '<h2>' + object.name + '</h2><p>';
      for (var field in object) {
        s += field + ' = ' + object[field] + '<br/>';
      }
      s += '</p>';
    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('results').innerHTML = s;
    });
  }


  /*
    Use a cursor to get objects by price
  */
  function getByPrice() {

    var lower = document.getElementById('priceLower').value;
    var upper = document.getElementById('priceUpper').value;
    var lowerNum = Number(document.getElementById('priceLower').value);
    var upperNum = Number(document.getElementById('priceUpper').value);

    if (lower === '' && upper === '') {return;}
    var range;
    if (lower !== '' && upper !== '') {
      range = IDBKeyRange.bound(lowerNum, upperNum);
    } else if (lower === '') {
      range = IDBKeyRange.upperBound(upperNum);
    } else {
      range = IDBKeyRange.lowerBound(lowerNum);
    }
    var s = '';
    dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readonly');
      var store = tx.objectStore('products');
      var index = store.index('price');
      return index.openCursor(range);
    }).then(function showRange(cursor) {
      if (!cursor) {return;}
      console.log('Cursored at:', cursor.value.name);
      s += '<h2>Price - ' + cursor.value.price + '</h2><p>';
      for (var field in cursor.value) {
        s += field + '=' + cursor.value[field] + '<br/>';
      }
      s += '</p>';
      return cursor.continue().then(showRange);
    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('results').innerHTML = s;
    });
  }

  /*
    Use a cursor to get objects by description
  */

  function getByDesc() {
    var key = document.getElementById('desc').value;
    if (key === '') {return;}
    // The function uses the 'only' method on IDBKeyrange to match all items with exactly the provided description.
    var range = IDBKeyRange.only(key); 
    var s = '';
    dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readonly');
      var store = tx.objectStore('products');
      var index = store.index('description');
      return index.openCursor(range);
    }).then(function showRange(cursor) {
      if (!cursor) {return;}
      console.log('Cursored at:', cursor.value.name);
      s += '<h2>Description - ' + cursor.value.description + '</h2><p>';
      for (var field in cursor.value) {
        s += field + '=' + cursor.value[field] + '<br/>';
      }
      s += '</p>';
      return cursor.continue().then(showRange);
    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('results').innerHTML = s;
    });
  }/*
    We add the current object to the html string, move on to the next object with cursor.continue(), 
    calling itself, passing in the cursor object. showRange loops through each object in the object store 
    until it reaches the end of the range.Then the cursor object is undefined and if (!cursor) {return;} breaks the loop.
  */


  //add items to the 'orders' object store
  function addOrders() {
    getItems('items/orders.json')
    .then(function(items){
      dbPromise.then(function(db) {  
        var tx = db.transaction('orders', 'readwrite');
        var store = tx.objectStore('orders');   
        items.forEach(function(item) {
          console.log('Adding item: ', item);
          store.add(item);
        });
        return tx.complete;
      }).then(function() {
        console.log('All items added successfully!');
      }).catch(function(e) {
        console.log('Error adding items: ', e);
      });
    });
  }

  function showOrders() {
    var s = '';
    dbPromise.then(function(db) {
      var tx = db.transaction('orders', 'readonly');
      var store = tx.objectStore('orders');
      return store.openCursor();
    }).then(function showRange(cursor) {
      if (!cursor) {return;}
      console.log('Cursored at:', cursor.value.name);

      s += '<h2>' + cursor.value.name + '</h2><p>';
      for (var field in cursor.value) {
        s += field + '=' + cursor.value[field] + '<br/>';
      }
      s += '</p>';

      return cursor.continue().then(showRange);
    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('orders').innerHTML = s;
    });
  }
  

  function getOrders() {
    return dbPromise.then(function(db) {
      var tx = db.transaction('orders');
      var store = tx.objectStore('orders');
      return store.getAll()
    });
  }

  /*From HERE*/

  function fulfillOrders() {
    getOrders().then(function(orders) {
      return processOrders(orders);
    }).then(function(updatedProducts) {
      updateProductsStore(updatedProducts);
    });
  }

  function processOrders(orders) {
    return dbPromise.then(function(db) {
      var tx = db.transaction('products');
      var store = tx.objectStore('products');
      return Promise.all(
        orders.map(function(order) {
          return store.get(order.id).then(function(product) {
            return decrementQuantity(product, order);
          });
        })
      );
    });
  }

  function decrementQuantity(product, order) {
    return new Promise(function(resolve, reject) {
      var item = product;
      var qtyRemaining = item.quantity - order.quantity;
      if (qtyRemaining < 0) {
        console.log('Not enough ' + product.id + ' left in stock!');
        document.getElementById('receipt').innerHTML =
        '<h3>Not enough ' + product.id + ' left in stock!</h3>';
        throw 'Out of stock!';
      }
      item.quantity = qtyRemaining;
      resolve(item);
    });
  }

  function updateProductsStore(products) {
    dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readwrite');
      var store = tx.objectStore('products');
      products.forEach(function(item) {
        store.put(item);
      });
      return tx.complete;
    }).then(function() {
      console.log('Orders processed successfully!');
      document.getElementById('receipt').innerHTML =
      '<h3>Order processed successfully!</h3>';
    });
  }

  return {
    dbPromise: (dbPromise),
    addProducts: (addProducts),
    getByName: (getByName),
    displayByName: (displayByName),
    getByPrice: (getByPrice),
    getByDesc: (getByDesc),
    addOrders: (addOrders),
    showOrders: (showOrders),
    getOrders: (getOrders),
    fulfillOrders: (fulfillOrders),
    processOrders: (processOrders),
    decrementQuantity: (decrementQuantity),
    updateProductsStore: (updateProductsStore)
  };
})();
