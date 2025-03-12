import CryptoJS from 'crypto-js';
let s = process.argv.splice(2)[0];
let str = CryptoJS.enc.Utf8.parse(s);
let encrypted = CryptoJS.enc.Base64.stringify(str);
console.log(encrypted);
