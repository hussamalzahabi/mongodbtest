const Mongoose = require("mongoose");


Mongoose.Promise = global.Promise;
Mongoose.connect("mongodb://localhost:27017/TodoApp");



module.exports = {Mongoose}