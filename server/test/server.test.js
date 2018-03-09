const expect = require("expect");
const request = require("supertest");
const {ObjectId} = require("mongodb")

const {app} = require("../server");
const {users , users2} = require("../model/Users");
const {userBody,userBody2 ,userFunc, userFunc2} = require("./../../seeds/seed")


beforeEach(userFunc)
beforeEach(userFunc2)


describe("POST /adduser", () => {

    it("Should be add users correctly !!", (done) => {

        var txt = "ahmed";

        request(app)
            .post("/adduser")
            .send({name: txt})
            .expect(200)
            .expect((req) => {
                expect(req.body.name).toBe(txt)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }


                users.find({name: txt}).then((res) => {

                    expect(res.length).toBe(1);
                    expect(res[0].name).toBe(txt);

                    done();

                }, (err) => done(err))


            })
    });

    it("Should be throw an error", (done) => {

        var txt = "";

        request(app)
            .post("/adduser")
            .send({name: null})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }


                users.find().then((res) => {

                    expect(res.length).toBe(2);

                    done();

                }, (err) => done(err))


            })
    });


});

describe('GET /showuser', () => {

    it("Should be contain 2 arrays", (done) => {

        request(app)
            .get("/showuser")
            .expect(200)
            .expect((res) => {
                expect(res.body.result.length).toBe(2);
            })
            .end(done)


    });

});

describe("GET /showuser/:id", () => {

    var id = new ObjectId().toHexString();


    it("should be return 200 status back and the name match with own id", (done) => {

        request(app)
            .get(`/showuser/${userBody[1]._id.toHexString()}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.name).toBe(userBody[1].name)
            })
            .end(done)

    })

    it("should be return 404 back which indicates that the id is not exists", (done) => {

        request(app)
            .get(`/showuser/${id}`)
            .expect(404)
            .end(done)

    })

    it("should be return 404 back which indicates that the id is not valid", (done) => {

        request(app)
            .get(`/showuser/${id + "d"}`)
            .expect(404)
            .end(done)
    })


})


describe("DELETE /user/:id", () => {

    let id = new ObjectId().toHexString();
    it("Should be delete the specific id and return 200", (done) => {

        request(app)
            .delete(`/user/${userBody[1]._id}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.result._id).toBe(userBody[1]._id.toHexString())
            })
            .end((err, res) => {

                if (err) {
                    return done(err)
                }

                users.findById(userBody[1]._id).then((result)=>{


                    expect(result).toNotExist();
                    done();

                },(error)=>done(error));


            });

    });


    it("Should be send 404 back , because the specific id is not found", (done) => {

        request(app)
            .delete(`/user/${id}`)
            .expect(404)
            .expect((response)=>{
                expect(response.body.reason).toBe("The id which you specified is not found !!")
            })
            .end(done);


    })

    it("Should be send 404 back , because the specific id is not valid", (done) => {

        request(app)
            .delete(`/user/${id+"d"}`)
            .expect(404)
            .expect((response)=>{
                expect(response.body.reason).toBe("Not valid id !!")
            })
            .end(done);


    })

});

describe("PATCH /user/:id",()=>{

    it("Should be to update as what it expected !!",(done)=>{
        //user 1
        let id = userBody[0]._id;

        request.agent(app)
            .patch(`/user/${id}`)
            .send({name:"khalid",activated:true})
            .expect(200)
            .expect((res)=>{

                expect(res.body.result.name).toBe("khalid")
                expect(res.body.result.activated).toBe(true)
                expect(res.body.result.activatedAt).toBeA("number")

            })
            .end(done)

    })

    it("Should be to set activated time field to null !!",(done)=>{
        //user 2
        let id = userBody[1]._id;

        request(app)
            .patch(`/user/${id}`)
            .send({name:"ramez",activated:false})
            .expect(200)
            .expect((res)=>{

                expect(res.body.result.name).toBe("ramez")
                expect(res.body.result.activated).toBe(false)
                expect(res.body.result.activatedAt).toNotExist();

            })
            .end(done)

    })

})

describe("GET users2/me/",()=>{

    it("Should be return an authenticate user",(done)=>{
        request(app)
            .get("/user2/me/")
            .set("x-auth",userBody2[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(userBody2[0]._id.toHexString())
                expect(res.body.email).toBe(userBody2[0].email)
            })
            .end(done)
    });

    it("Should be return 401 in none authenticate user",(done)=>{
        request(app)
            .get("/user2/me/")
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end(done)
    });

})

describe("POST user2/",()=>{

    it ("Should be create a user",(done)=>{
        var email = "hussam@hot.com", password = 12345678910;
        request(app)
            .post("/user2/")
            .send({email,password})
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toExist()
                expect(res.header["x-auth"]).toExist()
                expect(res.body.email).toBe(email)
            })
            .end((err,res)=>{

                if(err)
                    done(err)

                users2.findOne({
                   email
                }).then((result)=>{
                    expect(result.password).toNotBe(password)
                    done();

                }).catch((e)=>done(e))
            });
    })

    it("Should return validation error if request invalid",(done)=>{
        var email = "hussam.com", password = 34;
        request(app)
            .post("/user2/")
            .send({email,password})
            .expect(400)

            .end(done)
    })
    it("Should not create a user if the email is already exist",(done)=>{
        var email = userBody2[0].email , password = "dsadasdsadasdasda";
        request(app)
            .post("/user2/")
            .send({email,password})
            .expect(400)
            .end(done)
    })




})

describe("POST users2/login",()=>{

    it ("Should login user and return auth token",(done)=>{
        request(app)
            .post("/user2/login")
            .send(userBody2[1])
            .expect(200)
            .expect((response)=>{
                expect(response.header['x-auth']).toBeExist;
            })
            .end((err,result)=>{

                if (err){
                    done(err)
                }

                users2.findById(userBody2[1]._id).then((res)=>{
                    expect(res.tokens[0]).toInclude({access:"auth",token:result.header['x-auth']})
                    done();
                }).catch((e)=>done(e))
            })
    })
    it ("Should reject invalid login",(done)=>{
        request(app)
            .post("/user2/login")
            .send({email:userBody2[1].email+"dsd",password:userBody2[1].password})
            .expect(400)
            .expect((response)=>{
                expect(response.header['x-auth']).toNotExist;
            })
            .end((err,result)=>{

                if (err){
                    done(err)
                }

                users2.findById(userBody2[1]._id).then((res)=>{
                    expect(res.tokens.length).toBe(0)
                    done();
                })
            })

    })
})

describe("DELETE /user2/login/me",()=>{
    it("Should be remove an auth token after logout",(done)=>{
        let token = userBody2[0].tokens[0].token;
        request(app)
            .delete("/user2/me/token")
            .set("x-auth",token)
            .expect(200)
            .end((err,response)=>{

                if (err)
                    return done(err)

                users2.findById(userBody2[0]._id).then((result)=>{
                    expect(result.tokens.length).toBe(0)
                    done();
                }).catch((e)=>done(e))
            })
    })
})