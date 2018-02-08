const express = require("express")
const bodyParser = require("body-parser")

const {ObjectId} = require("mongodb")
const {Mongoose}  = require("./db/mongoose")
const {users}  = require("./model/Users")
const {Notes}  = require("./model/Notes")



var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.post("/adduser",(req,res)=>{

    var Users = new users({name:req.body.name,age:req.body.age,occupation:req.body.occupation});

    Users.save().then((result)=>{
        res.send(result)
    },(err)=>{
        res.status(400).send(err)
    })

})

app.get("/showuser",(req,res)=>{

    users.find().then((result)=>{

        res.send({result})


    },(err) => res.send(err));

});

app.get("/showuser/:id",(req,res)=>{

    var id = req.params.id;
    if (!ObjectId.isValid(id)){
        res.status(404).send({});
    }


    users.findById(id).then((results)=>{

        if (results){
            res.send(results)
        }
        else {
            res.status(404).send({});
        }

    }).catch(e=>res.status(400))



});

app.listen(port,()=>{
    console.log(`connecting on ${port} port`)
})

module.exports = {app}