function Promise(executor) {
	let self = this;
	self.status = 'padding';
	self.value = undefined;
	self.resron = undefined;
	self.onResolevdCallbacks = [];
	self.onRejectedCallbacks = [];
	let resolve = function(value) {
		if (self.status === 'padding') {
			self.value = value;
			self.status = 'resolved';
			self.onResolevdCallbacks.forEach(fn => fn())
		}
	}
	let reject = function(resron) {
		if (self.status === 'padding') {
			self.resron = resron;
			self.status = 'rejected';
			self.onRejectedCallbacks.forEach(fn => fn())
		}

	}
	try{
		executor(resolve, reject)
	}catch(e) {
		reject(e)
	}
}
let resolvePromise = (promise2, x, resolve, reject) => {
	if (x === promise2) {
		return reject(new TypeError('循环引用'))
	}
	let called   
	// 如果 x 是一个函数，或者 x 是一个对象，就有可能 x 是一个 promise
	if (x !==null && (typeof x === 'function' || typeof x === 'object')) {
		try{
			let then = x.then;
			if (typeof then == 'function') { // 是 promise
				then.call(x,y => {
					if (!called) called = true
					else return 
					resolvePromise(promise2, y, resolve, reject)
				}, r => {
					if (!called) called = true
					else return 
					reject(r)
				})
			} else { // {then: 123}
			if (!called) called = true
					else return 
				resolve(x)
			}
		}catch(e) { // 如果 x 取 then 的时候，可能会发生异常，如果有异常
			reject(e)
		}
	} else { // 普通值的情况，直接成功
		resolve(x)
	}
}
Promise.prototype.then = function(onFulfilled = res => res, onRejected = err => {throw err }) {
	let self = this;
	console.log(this)
	let promise2 
	promise2 = new Promise((resolve, reject) => {
		if (self.status === 'resolved') {
			setTimeout(() => {
				try{
					let x =	onFulfilled(self.value)
					resolvePromise(promise2, x, resolve, reject)
				}catch(e) {
					reject(e)
				}
			}, 0)
		}
		if (self.status === 'rejected') {
			setTimeout(() => {
				try{
					let x =	onRejected(self.resron)
					resolvePromise(promise2, x, resolve, reject)
				} catch(e) {
					reject(e)
				}
			}, 0)
		}
		if (self.status === 'padding') {
			self.onResolevdCallbacks.push(() => {
				setTimeout(() => {
					try{
						let x =	onFulfilled(self.value)
						resolvePromise(promise2, x, resolve, reject)
					}catch(e) {
						reject(e)
					}
				}, 0)
			})
			// 当异步执行 promise 内函数时，当前实例状态还是 padding，则把所有 then 里的函数传入实例的执行栈中
			
			self.onRejectedCallbacks.push(() => {
				setTimeout(() => {
					try{
						let x =	onRejected(self.resron)
						resolvePromise(promise2, x, resolve, reject)
					} catch(e) {
						reject(e)
					}
				}, 0)
			})
		}
	})
	return promise2
}
Promise.prototype.catch = function(errFn) {
	return this.then(null,errFn)
}
Promise.reject = function(err) {
	return new Promise((resolve, reject) => {
		reject(err)
	})
}
Promise.resolve = function(value) {
	return new Promise((resolve, reject) => {
		resolve(err)
	})
}
Promise.all = function(promises) {
	return new Promise((resolve, reject) => {
		let arr = []
		let currentIndex = 0
		function processData(index, value) {
			arr[index] = value
			currentIndex++
			if (currentIndex === promises.length) {
				resolve(arr)
			}
		}
		for (let i = 0; i<promises.length; i++) {
			promises[i].then(res => {
				processData(i,res)
			}, reject)
		}
	})
}
Promise.race = function() {
	return new Promise((resolve, reject) => {
		for (let i = 0; i<promises.length; i++) {
			promises[i].then(resolve, reject)
		}
	})
}
Promise.prototype.finally = function(cb) {
	return this.then(res => {
		return Promise.resolve(cb()).then(() => res)
	}, err => {
	 return	Promise.reject(cb()).then(() => {throw err})
	})
}
Promise.defer = Promise.deferred = function() {
	let dfd = {};
	dfd.promise = new Promise((resolve, reject) => {
		dfd.resolve = resolve;
		dfd.reject = reject;
	})
	return dfd
}
module.exports = Promise;