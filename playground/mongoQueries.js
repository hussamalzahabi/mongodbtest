const mongoose = require("./../server/db/mongoose");
const {users} = require("./../server/model/Users");
const {ObjectId} = require("mongodb")

var Id = "5a7b74da5bed2954027e9410"
if (!ObjectId.isValid(Id)){
    return console.log("The id not valid !!");
}

users.find({_id:Id}).then((result)=>{

    if (result.length !== 0) {
        console.log(result)

    }
    else {
        return console.log("The item is not found !!");

    }
})


users.findOne({_id:Id}).then((result)=>{

    if (result) {
        console.log(result)

    }
    else {
        return console.log("The item is not found !!");

    }
})

users.findById(Id).then((result)=>{

    if (result) {
        console.log(result)

    }
    else {
        return console.log("The item is not found !!");

    }

}).catch((err)=>console.log(err))
