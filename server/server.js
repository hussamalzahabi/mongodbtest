require("./../config/config")

const express = require("express")
const bodyParser = require("body-parser")
const _ = require("lodash");

const {ObjectId} = require("mongodb")
const {Mongoose}  = require("./db/mongoose")
const {users}  = require("./model/Users")
const {Notes}  = require("./model/Notes")



var port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post("/adduser",(req,res)=>{

    var Users = new users({name:req.body.name,age:req.body.age,occupation:req.body.occupation,activated:false,
    activatedAt:new Date().getTime()});

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

app.delete("/user/:id",(req,res)=>{

  var id = req.params.id;

  if(!ObjectId.isValid(id)){
      return res.status(404).send({"reason":"Not valid id !!"});
  }

  users.findByIdAndRemove(id).then((result)=>{

      if (result)
          res.send({result})
      else
          res.status(404).send({"reason":"The id which you specified is not found !!"})
  },(err)=>{res.status(400).send(err)})



});

app.patch("/user/:id",(req,res)=>{

    var id = req.params.id;
    var body = _.pick(req.body , ['name','age','occupation','activated'])
    if(!ObjectId.isValid(id)){
        return res.status(404).send({"reason":"Not valid id !!"});
    }

    if (_.isBoolean(body.activated) && body.activated){
        body.activatedAt = new Date().getTime();
    }
    else {
        body.activated = false;
        body.activatedAt = null;
    }
    users.findByIdAndUpdate(id,{$set:body},{new:true}).then((result)=>{

        if (result)
            res.send({result})
        else
            res.status(404).send({"reason":"The id which you specified is not found !!"})

    }).catch((error)=>res.status(400).send(error))



})


app.listen(port,()=>{
    console.log(`connecting on ${port} port`)
})

module.exports = {app}