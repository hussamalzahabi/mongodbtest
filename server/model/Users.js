const Mongoose = require("mongoose");
const validator = require("validator")
const _ = require("lodash")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")





userSchema = new Mongoose.Schema({

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

userSchema.methods.toJSON = function () {
    var user = this;
    user = user.toObject();

    return _.pick(user, ["email", "_id"])
}

userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";
    var data = {_id: user._id, access}

    var token = jwt.sign(data, process.env.JWT_SECRET).toString();


    user.tokens = user.tokens.concat([{token, access}]);


    return user.save().then(() => {
        return token;
    })


}


userSchema.methods.removeToken = function (token) {

    let user = this;

    return user.update({
            $pull: {tokens: {token}}
        }
    )

}

userSchema.statics.findByToken = function (token) {
    var User = this, decoded;

    try {

        decoded = jwt.verify(token, process.env.JWT_SECRET);

    } catch (err) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': "auth"
    });

}

userSchema.statics.findByCredential = function (email, password) {

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


userSchema.pre("save", function (next) {
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
var users = Mongoose.model("users", userSchema);

module.exports = {users}