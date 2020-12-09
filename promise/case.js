let Promise = require('../promise.js');
let p = new Promise((resolve, reject) => {
	setTimeout(() => resolve('err'), 1000)
})
p.then((res) => {
	throw new Error
}, err => {
	console.log(err)
}).then(res => {
	console.log(res)
}, err => {
	console.log('err', err)
})