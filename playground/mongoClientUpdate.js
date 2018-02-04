const {MongoClient, ObjectId} = require("mongodb");


var url = "mongodb://localhost:27017/TodoApp"
MongoClient.connect(url, (error, db) => {

    if (error) {
        return console.log("Unable to connect !!")
    }

    db.collection("Users").findOneAndUpdate(
        {
            _id: new ObjectId("5a65238403891d7deb6b8abe")
        },
        {
            $set: {name: "hussam"},
            $inc: {age:4}
        },
        {returnOriginal: false}
    )
        .then((result) => {
            console.log(result)
        }, (error) => {
            console.log(error)
        });


})