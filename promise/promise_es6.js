// const Promise = require("./promise_es5");

// const Promise = require("./promise_es5");

class Promise {
  constructor(executor) {
    this.init(executor)
  }
  init(executor) {
    this.status = 'padding';
    this.value = undefined;
    this.err = undefined;
    this.onResolevdCallbacks = [];
    this.onRejectedCallbacks = [];
    try{
      executor(this.resolve.bind(this),this.reject.bind(this))
    }catch(e) {
      this.reject(e)
    }
  }
  resolve(data) {
    // console.log(this)
    if (this.status === 'padding') {
      this.status = 'resolved'
      this.value = data
      this.onResolevdCallbacks.forEach(fn => fn())
    }
  }
  reject(err){
    if (this.status !== 'padding') return 
    this.status = 'rejected'
    this.err = err
    this.onRejectedCallbacks.forEach(fn => fn())
  }
  then(onFulfilled = res => res, onRejected = err => {throw err}) {
    let promise2
    promise2 = new Promise((resolve, reject) => {
      if (this.status === 'resolved') {
        setTimeout(() => {
          try{
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        })
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          try{
            let x = onFulfilled(this.err)
            resolvePromise(promise2, x, resolve, reject)
          }catch(e ) {
            reject(e)
          }
        })
      }
      if (this.status === 'padding') {
          this.onResolevdCallbacks.push(() => {
            setTimeout(() => {
              try{
                let x = onFulfilled(this.value)
                resolvePromise(promise2, x, resolve, reject)
              }catch(e) {
                reject(e)
              }
            })
          })
          this.onRejectedCallbacks.push(() => {
            setTimeout(() => {
              try{
                let x = onRejected(this.err)
                resolvePromise(promise2, x, resolve, reject)
              }catch(e) {
                reject(e)
              }
            })
          })
      }
    })
    return promise2
  }
}
const resolvePromise = (promise2, x, resolve, reject) => {
  if (x === promise2) reject(new TypeError('循环引用'))
  let called  
  if (x !==null && (typeof x === 'function' || typeof x === 'object')) {
    try{
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, r => {
          if (!called) called = true
					else return 
					resolvePromise(promise2, r, resolve, reject)
        }, y => {
          if (!called) called = true
					else return 
					reject(y)
        })
      } else {
        if (!called) called = true
        else return 
        resolve(x)
      }
    }catch(e) {
      reject(e)
    }
  }
}

let p = new Promise((resolve,reject) => {
  resolve(111)
}).then(res => {
  console.log(res)
  return 222
}).then(res => {
  console.log(res)
})