import CryptoJS from 'crypto-js';

let encrypted = process.argv.splice(2)[0];
let decrypted = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Utf8);
console.log(decrypted); 
