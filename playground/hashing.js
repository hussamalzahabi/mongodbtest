const {SHA256} = require("crypto-js");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");



bcrypt.genSalt(10,(error,salt)=>{

    bcrypt.hash("hussam",salt,(error,hash)=>{
         console.log(hash);
    })
})

var pass = "$2a$10$NzqZYKa/j7EPy6I4FmQ.0eF5QYyzI1c4RK3t5ECZnTnHKBKKLgsPa";
bcrypt.compare("hussam",pass,(err,res)=>{
    console.log(res)
})

/*var data = {id:4};



var encrypt = jwt.sign(data,"abc123").toString();
var decrypt = jwt.verify(encrypt,"abc123");

console.log("encrypted data" ,encrypt)
console.log("decrypted data" ,decrypt)*/

/*
var data = {id:4};


var tokens = {
    data,
    hash: SHA256(JSON.stringify(data) + "abc123").toString()
}
console.log(tokens)

tokens.data.id = 4;
var results = SHA256(JSON.stringify(tokens.data) + "abc123").toString();
console.log(results)
if (results === tokens.hash) {
    console.log("the data was not manipulated")
}
else {
    console.log("the data is not trusted")
}
*/
