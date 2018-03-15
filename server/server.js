require("./../config/config");

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const {ObjectId} = require("mongodb");
const {Mongoose} = require("./db/mongoose");
const {users} = require("./model/Users");
const {todo} = require("./model/todo");
const {authenticate} = require("./../MiddleWare/auth");


var port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post("/todo", authenticate , (req, res) => {

    var body = req.body , id = req.user._id;
    var Todo = new todo({
        text: body.text,
        _creator:id
    });

    Todo.save().then((result) => {
        res.send(result)
    }, (err) => {
        res.status(400).send(err)
    })

})

app.get("/todo", authenticate,  (req, res) => {

    todo.find({_creator:req.user._id}).then((result) => {

        res.send({result})


    }, (err) => res.send(err));

});

app.get("/todo/:id", authenticate , (req, res) => {

    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.status(404).send({});
    }


    todo.findOne({_id:id,_creator:req.user._id}).then((results) => {

        if (results) {
            res.send(results)
        }
        else
            {
            res.status(404).send({});
        }

    }).catch((e) => res.status(400))


});

app.delete("/todo/:id", authenticate , (req, res) => {

    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send({"reason": "Not valid id !!"});
    }

    todo.findOneAndRemove({_id:id,_creator:req.user._id}).then((result) => {

        if (result)
            res.send({result})
        else
            res.status(404).send({"reason": "The id which you specified is not found !!"})
    }, (err) => {
        res.status(400).send(err)
    })


});

app.patch("/todo/:id", authenticate , (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed'])
    if (!ObjectId.isValid(id)) {
        return res.status(404).send({"reason": "Not valid id !!"});
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }
    todo.findOneAndUpdate({_id:id,_creator:req.user._id}, {$set: body}, {new: true}).then((result) => {

        if (result)
            res.send({result})
        else
            res.status(404).send({"reason": "The id which you specified is not found !!"})

    }).catch((error) => res.status(400).send(error))


})

app.post("/user/", (req, res) => {

    var body = _.pick(req.body, ["email", "password"]);

    var user = new users(body);

    user.save().then((user) => {

        return user.generateAuthToken();

    }).then((token) => {
        res.header("x-auth", token).send(user)
    }).catch((err) => res.status(400).send(err))


});


app.get("/user/me", authenticate, (req, res) => {

    res.send(req.user)

});

app.post("/user/login", (req, response) => {

    let body = req.body;
    body = _.pick(body,["email","password"])

    users.findByCredential(body.email,body.password).then((result) => {

        return result.generateAuthToken().then((token)=>{
            response.header("x-auth",token).send(result)
        })

    }).catch((err)=>{response.status(400).send({err}) })
})

app.delete("/user/me/token",authenticate,(req,res)=>{

    let user = req.user , token = req.token;

    user.removeToken(token).then(()=>{
        res.send("Successful logout !!")
    },()=>{
        res.status(400).send()
    })

})

app.listen(port, () => {
    console.log(`connecting on ${port} port`)
})

module.exports = {app}