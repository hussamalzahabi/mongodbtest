const {ObjectId} = require("mongodb")
const {users} = require("./../server/model/Users")
const {todo} = require("./../server/model/todo")
const jwt = require("jsonwebtoken")
var userId1 = new ObjectId();
var userId2 = new ObjectId();
var todoBody = [{_id: new ObjectId(), text: "hussam" , _creator:userId1}
    , {_id: new ObjectId(), text: "layth" , _creator: userId2}];


var userBody = [{_id:userId1,
    email:"hz_php@hotmail.com",
    password:"1233213212",
    tokens:[{
        access:"auth",
        token: jwt.sign({_id:userId1,access:"auth"},process.env.JWT_SECRET).toString()
    }]
},
    {
        _id:userId2,
        email:"hz_js@hotmail.com",
        password:"13213123131",
        tokens:[{
            access:"auth",
            token: jwt.sign({_id:userId2,access:"auth"},process.env.JWT_SECRET).toString()
        }]

    }];

var todoFunc = (done) => {

    todo.remove({}).then((result) => {

        todo.insertMany(todoBody).then(() => {
            done();
        }).catch(err=>done(err))

    })
}

var userFunc = (done) =>{
    users.remove({}).then((result) => {

        var usersFirst = new users(userBody[0]).save();
        var usersSecond = new users(userBody[1]).save();

        return Promise.all([usersFirst,usersSecond])
    }).then(()=>done()).catch(err=>done(err))
}


module.exports = {userFunc , todoFunc, userBody , todoBody}