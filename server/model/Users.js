const Mongoose = require("mongoose");


var users = Mongoose.model("Users",{

    name:{type:String, required: true , minLength: 1, trim:true},
    age:{type:Number , minLength:1 , trim: true},
    occupation:{type:String , trim: true}


})

module.exports = {users}