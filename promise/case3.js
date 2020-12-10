let Promise = require('./promise_es6.js');
let p = new Promise((resolve, reject) => {
	reject(100)
})

Promise.all([new Promise((r,j) => {r(333)}), 444, () => 222, 000]).then(res => {
	console.log(res)
})

