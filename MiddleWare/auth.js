const {users}  = require("./../server/model/Users")

var authenticate = (req, res, next) => {
    var token = req.header("x-auth");


    users.findByToken(token).then((result) => {

        if (!result) {
            return Promise.reject()
        }


        req.user = result;
        req.token = token;

        next();

    }).catch((err) => res.status(401).send())

}

module.exports = {authenticate}