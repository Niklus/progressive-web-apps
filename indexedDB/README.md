# IndexedDB

Client-side storage solution for structured data
* Non-relation database
* Stores: JS objects, files, blobs, etc.
* Unique to an origin
* Large storage limits

## Terms
* Database - Contains the object stores to persist
* Object Store - An individual bucket to store data
* Index - A kind of object store for organizing data in another object store by an individual property of the data
* Operation - An interaction with the database (add, get, put, delete, getAll. cursor)
* Transaction - A wrapper around an operation, or group of operations, that ensures database integrity.
* Cursor- A mechanism for iterating over multiple records in database.

All data operations in IndexedDB are carried out inside a transaction. Each operation has this form:
* Get database object
* Open transaction on database
* Open object store on transaction
* Perform operation on object store