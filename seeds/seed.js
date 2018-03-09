const {ObjectId} = require("mongodb")
const {users , users2} = require("./../server/model/Users")
const jwt = require("jsonwebtoken")
var userBody = [{_id: new ObjectId(), name: "hussam"}
    , {_id: new ObjectId(), name: "layth"}];

var userId1 = new ObjectId();
var userId2 = new ObjectId();
var userBody2 = [{_id:userId1,
    email:"hz_php@hotmail.com",
    password:"1233213212",
    tokens:[{
        access:"auth",
        token: jwt.sign({_id:userId1,access:"auth"},"abc123").toString()
    }]
},
    {
        _id:userId2,
        email:"hz_js@hotmail.com",
        password:"13213123131"

    }];

var userFunc = (done) => {

    users.remove({}).then((result) => {

        users.insertMany(userBody).then(() => {
            done();
        })

    })
}

var userFunc2 = (done) =>{
    users2.remove({}).then((result) => {

        var usersFirst = new users2(userBody2[0]).save();
        var usersSecond = new users2(userBody2[1]).save();

        return Promise.all([usersFirst,usersSecond])
    }).then(()=>done())
}


module.exports = {userFunc , userFunc2, userBody , userBody2}