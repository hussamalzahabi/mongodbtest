var {MongoClient,ObjectId} = require("mongodb")


MongoClient.connect("mongodb://localhost:27017/TodoApp",(error,db)=>{

    if (error){
        console.log("Unable to connect :",error)
        return;

    }

    // deleteMany
    /*db.collection("Users").deleteMany({name:"hussam"}).then((result)=>{
        console.log(result)
    });*/

    // deleteOne

   /* db.collection("Users").deleteOne({name:"ahmed"}).then((result)=>{
        console.log(result)
    });*/

    // fintAndDelete

    db.collection("Users").findOneAndDelete({name:"ahmed"}).then((result)=>{
        console.log(result)
    })


    //db.close()

})