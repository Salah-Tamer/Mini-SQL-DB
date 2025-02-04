// lib/mutex.js

/**
 * @module mutex
 * @description Implements a mutex for manging exclusive access to resources.
 */

class Mutex {
  constructor() {
    this._queue = [];
    this.locked = false;
  }

  lock() {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        if (!this.locked) {
          this.locked = true;
          console.log("[Mutex] lock acquired");

          resolve(this.unlock.bind(this));
        } else {
          console.log("[Mutex] Lock busy, request queued");
          this._queue.push(tryAcquire);
        }
      };

      tryAcquire();
    });
  }

  unlock() {
    if (this._queue.length > 0) {
      console.log("[Mutex] passing the lock to the next function in the queue");

      this.locked = false;

      const next = this._queue.shift();

      next(); // Since next is a function (tryAcquire), calling next(); tries to acquire the lock again.
    } else {
      console.log("[Mutex] Lock released");
      this.locked = false;
    }
  }
}

export default Mutex;
