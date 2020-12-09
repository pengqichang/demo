const { RSA_NO_PADDING } = require('constants');
let fs = require('fs');
fs.readFile('./vuedemo.html','utf8', (err, data) => {
  console.log(data)
})