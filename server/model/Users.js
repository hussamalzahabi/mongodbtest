const Mongoose = require("mongoose");
const validator = require("validator")
const _ = require("lodash")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


var users = Mongoose.model("Users", {

    name: {type: String, required: true, minLength: 1, trim: true},
    age: {type: Number, minLength: 1, trim: true},
    occupation: {type: String, trim: true},
    activated: {type: Boolean, trim: true},
    activatedAt: {type: Number}


})

users2Schema = new Mongoose.Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: (v) => {
                return validator.isEmail(v)
            },
            message: "{VALUE} is not a valid email !"
        },
        minLength: 1

    },
    password: {
        type: String,
        required: true,
        minlength: 9
    }
    ,
    tokens: [{
        access: {
            required: true,
            type: String
        },
        token: {
            required: true,
            type: String
        }
    }]

});

users2Schema.methods.toJSON = function () {
    var user = this;
    user = user.toObject();

    return _.pick(user, ["email", "_id"])
}

users2Schema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";
    var data = {_id: user._id, access}

    var token = jwt.sign(data, "abc123").toString();


    user.tokens = user.tokens.concat([{token, access}]);


    return user.save().then(() => {
        return token;
    })


}


users2Schema.methods.removeToken = function (token) {

    let user = this;

    return user.update({
        $pull:{tokens:{token}}
    }
        )

}

users2Schema.statics.findByToken = function (token) {
    var User = this, decoded;

    try {

        decoded = jwt.verify(token, "abc123");

    } catch (err) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': "auth"
    });

}

users2Schema.statics.findByCredential = function (email, password) {

    let User = this;

    return User.findOne({email}).then((result) => {

        if (!result) {
            return Promise.reject("The user is not found !!");
        }

        return new Promise((resolve, reject) => {

            bcrypt.compare(password, result.password, (err, res) => {

                if (res) {

                    resolve(result)
                }
                else {
                    reject("The password dosen't match with the typed email !!");

                }

            })
        })


    })

};


users2Schema.pre("save", function (next) {
    var user = this;
    if (user.isModified("password")) {

        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {

                user.password = hash;
                next();

            })
        });
    }
    else {
        next();
    }
})
var users2 = Mongoose.model("users2", users2Schema);

module.exports = {users, users2}