# Promises: Async Code Simplified

Promises offer a better way to handle asynchronous code in JavaScript. Nested callbacks dont scale well and are hard to debug

## Promise Terminology

* **Pending** - The promise's outcome hasn't yet been determined, the async operation that will produce its result hasn't completed yet.

* **Fulfilled** - The operation resolved and the promise has a value.

* **Rejected** - The operation failed and the promise will never be fulfilled. A failed promise has a reason indicating why it failed.

* **Settled** : A promise that has been acted upon, and is either fulfilled or rejected.
