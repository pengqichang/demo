let Promise = require('./promise_es5.js');
let p = new Promise((resolve, reject) => {
	reject(100)
})

p.then()

