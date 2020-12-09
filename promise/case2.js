let Promise = require('./promise_es5.js');
let p = new Promise((resolve, reject) => {
	resolve(100)
})
let p2 = p.then(res => {
  return new Promise((r,y) => {
    r(2000)
  })
}).then(res => {
  return res + 2000
}, err => {
  console.log(err)
}).then( res => {
  console.log(res)
})