const {MongoClient,ObjectId} = require("mongodb");


var id = new ObjectId();

console.log(id)

var url = "mongodb://localhost:27017/TodoApp";

MongoClient.connect(url,(error,db)=>{

    if (error){
        return console.log("Unable to Connect")
    }


/*
    db.collection("Users").insertOne({
        name:"hussam",
        age:34,
        occupation:"programmer"
    },(error,result)=>{
        if (error){
            return console.log("Unexpected error")
        }
        console.log("Successful insertion")
        console.log(result.ops[0]._id.getTimestamp())
    });
    console.log("Successful connection");
*/

db.collection("Users").find({name:"ahmed"}).toArray().then((docs)=>{

    console.log(docs)

},(err)=>{
    console.log(err)
});

    db.collection("Users").find().count().then((count)=>{

        console.log(count)

    },(err)=>{
        console.log(err)
    });


    db.close();

})