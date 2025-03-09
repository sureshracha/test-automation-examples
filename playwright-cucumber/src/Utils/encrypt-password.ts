let CryptoJS = require('crypto-js');
let str = CryptoJS.enc.Utf8.parse(process.argv.splice(2)[0]);
console.log(CryptoJS.enc.Base64.stringify(str)); 
