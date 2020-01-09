import { resolve } from "dns";
import { rejects } from "assert";

const PENDING = 'pending';
const FULLFILLED = 'fullfilled';
const REJECTED = 'rejected';

function myPromise(callback) {
  let self = this;
  this.status = PENDING;
  this.value = undefined;
  this.onResolve = [];
  this.onReject = [];

  function resolve(data) {
    if (data instanceof myPromise) {
      data.then(resolve, reject);
    }

    setTimeout(() => {
      if(self.status === PENDING) {
        self.status = FULLFILLED;
        self.value = data;
        self.onResolve.forEach(res => res(self.value));
      }
    }, 0)
  }

  function reject(err) {
    setTimeout(() => {
      if(self.status === PENDING) {
        self.status = REJECTED;
        self.value = err;
        self.onReject.forEach(rej => rej(self.value));
      }
    }, 0)
  }

  try {
    callback(resolve, reject);
  } cache(e) {
    reject(e);
  }
}

myPromise.prototype.resolve = function(data) {
  return new myPromise(function(resolve, reject) {
    resolve(data);
  })
}

myPromise.prototype.reject = function(err) {
  return new myPromise(function(resolve, reject) {
    reject(err);
  })
}

myPromise.prototype.then = function(resFn, rejFn) {
  let self = this;

  if (self.status === FULLFILLED) {
    return new myPromise(function(resolve, reject) {
      let res = resFn(self.value);
      if (res instanceof myPromise) {
        res.then(resolve, reject);
      } else {
        resolve(res);
      }
    })
  }

  if (self.status === REJECTED) {
    return new myPromise(function(resolve, reject) {
      let res = rejFn(self.value);
      if (res instanceof myPromise) {
        res.then(resolve, reject);
      }else {
        reject(res);
      }
    })
  }

  if (self.status === PENDING) {
    return new myPromise(function(resolve, reject) {
      self.onResolve.push(function(data) {
        if (self.status === FULLFILLED) {
          let res = resFn(data);
          if (res instanceof myPromise) {
            res.then(resolve, reject);
          } else {
            resolve(res);
          }
        }
      });

      self.onReject.push(function(err) {
        return new myPromise(function(resolve, reject) {
          let res = rejFn(err);
          if (res instanceof myPromise) {
            res.then(resolve, reject);
          }else {
            reject(res);
          }
        })
      });
    })
  }
}

myPromise.prototype.catch = function(err) {
  this.status = 'rejected';
  throw new Error(err);
}

myPromise.prototype.all = function(parr) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let arr = [];
    parr.forEach((p, index) => {
      p.then((data) => {
        count ++;
        arr[index] = data;
        if (count === parr.length) {
          resolve(arr);
        }
      }, reject);
    })
  })
}

myPromise.prototype.race = function(parr) {
  return new Promise((resolve, reject) => {
    parr.forEach((p) => {
      p.then(data => {
        resolve(data);
      }, reject);
    })
  })
}