const Mongoose = require("mongoose");


var Notes = Mongoose.model("Notes",{

    text:{type:String, required: true , minLength: 1, trim:true},


})

module.exports = {Notes}