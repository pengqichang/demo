
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
  resolve (data) {
    // console.log(this)
    if (this.status === 'padding') {
      this.status = 'resolved'
      this.value = data
      this.onResolevdCallbacks.forEach(fn => fn())
      // console.log(this.onResolevdCallbacks)
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
  static all (arg) {
    let arr = []
    let index = 0
    function resolvePromise(fn, i) {
      return new Promise((r,j) => {
        try{
          if (fn instanceof Promise) 
          fn.then(res => {
            r(res)
          },j)
          else r(fn)
        }catch(e) {
          j(e)
        }
      })
    }
    return new Promise((resolve, reject) => {
      arg.forEach((fn,i) => {
        resolvePromise(fn,i).then(r => {
          arr[i] = r
          index++
          if (index === arg.length) resolve(arr)
        }, reject)
      })
    })
  }
  static race (arg){
    return new Promise((resolve, reject) => {
      arg.forEach(fn => {
        fn.then(resolve, reject)
      })
    })
  }
  static resolve(res) {
    return new Promise((resolve, reject) => resolve(res))
  }
  static reject(res) {
    return new Promise((resolve, reject) => reject(res))
  }
  finally(cb) {
    return this.then(res => {
      return Promise.resolve(cb()).then(() => res)
    }, err => {
     return	Promise.reject(cb()).then(() => {throw err})
    })
  }
  static defer() {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    })
    return dfd
  }
  static deferred = this.defer
}
const resolvePromise = (promise2, x, resolve, reject) => {
  if (x === promise2) reject(new TypeError('循环引用'))
  if (x instanceof Promise) {
    try{
      x.then(resolve, reject)
    }catch(e) {
      reject(e)
    }
  } else {
    resolve(x)
  }
}


module.exports = Promise;