const Mongoose = require("mongoose")

let todo = Mongoose.model("Todo",{

    text: {type: String, required: true, minLength: 1, trim: true},
    completed: {type: Boolean, trim: true , default: false},
    completedAt: {type: Number , default: null},
    _creator: {type: Mongoose.Schema.Types.ObjectId , required:true}


});


module.exports = {todo};