const Mongoose = require("mongoose");


Mongoose.Promise = global.Promise;
Mongoose.connect(process.env.MONGODB_URI);



module.exports = {Mongoose}