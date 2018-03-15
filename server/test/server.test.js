const expect = require("expect");
const request = require("supertest");
const {ObjectId} = require("mongodb")

const {app} = require("../server");
const {users} = require("../model/Users");
const {todo} = require("../model/todo");
const {userBody,todoBody ,userFunc, todoFunc} = require("./../../seeds/seed")


beforeEach(userFunc)
beforeEach(todoFunc)


describe("POST /todo", () => {

    it("Should be add users correctly !!", (done) => {

        var text = "ahmed";

        request(app)
            .post("/todo")
            .set("x-auth",userBody[1].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((req) => {
                expect(req.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }


                todo.find({text}).then((res) => {

                    expect(res.length).toBe(1);
                    expect(res[0].text).toBe(text);

                    done();

                }, (err) => done(err))


            })
    });

    it("Should be throw an error", (done) => {

        var text = "";

        request(app)
            .post("/todo")
            .set("x-auth",userBody[1].tokens[0].token)
            .send({text: null})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }


                todo.find().then((res) => {

                    expect(res.length).toBe(2);

                    done();

                }, (err) => done(err))


            })
    });


});

describe('GET /todo', () => {

    it("Should be contain 2 arrays", (done) => {

        request(app)
            .get("/todo")
            .set("x-auth",userBody[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.length).toBe(1);
            })
            .end(done)


    });

});

describe("GET /todo/:id", () => {

    it("should be return 200 status back and the name match with own id", (done) => {

        request(app)
            .get(`/todo/${todoBody[1]._id.toHexString()}`)
            .set("x-auth",userBody[1].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.name).toBe(todoBody[1].name)
            })
            .end(done)

    })

    it("should be not return 404 status back which indicate that a user dosen't permitted to fetch todo", (done) => {

        request(app)
            .get(`/todo/${todoBody[1]._id.toHexString()}`)
            .set("x-auth",userBody[0].tokens[0].token)
            .expect(404)
            .end(done)

    })

    it("should be return 404 back which indicates that the id is not exists", (done) => {

        request(app)
            .get(`/todo/${new ObjectId().toHexString()}`)
            .set("x-auth",userBody[0].tokens[0].token)
            .expect(404)
            .end(done)

    })

    it("should be return 404 back which indicates that the id is not valid", (done) => {

        request(app)
            .get(`/todo/${new ObjectId().toHexString() + "d"}`)
            .set("x-auth",userBody[0].tokens[0].token)
            .expect(404)
            .end(done)
    })


})


describe("DELETE /todo/:id", () => {

    let id = new ObjectId().toHexString();
    it("Should be delete the specific id and return 200", (done) => {

        request(app)
            .delete(`/todo/${todoBody[1]._id}`)
            .set("x-auth",userBody[1].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.result._id).toBe(todoBody[1]._id.toHexString())
            })
            .end((err, res) => {

                if (err) {
                    return done(err)
                }

                todo.findById(todoBody[1]._id).then((result)=>{


                    expect(result).toNotExist();
                    done();

                },(error)=>done(error));


            });

    });

    it("Should not be delete the specific id and return 200", (done) => {

        request(app)
            .delete(`/todo/${todoBody[1]._id}`)
            .set("x-auth",userBody[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {

                if (err) {
                    return done(err)
                }

                todo.findById(todoBody[1]._id).then((result)=>{


                    expect(result).toExist();
                    done();

                },(error)=>done(error));


            });

    });

    it("Should be send 404 back , because the specific id is not found", (done) => {

        request(app)
            .delete(`/todo/${id}`)
            .set("x-auth",userBody[1].tokens[0].token)
            .expect(404)
            .expect((response)=>{
                expect(response.body.reason).toBe("The id which you specified is not found !!")
            })
            .end(done);


    })

    it("Should be send 404 back , because the specific id is not valid", (done) => {

        request(app)
            .delete(`/todo/${id+"d"}`)
            .set("x-auth",userBody[1].tokens[0].token)
            .expect(404)
            .expect((response)=>{
                expect(response.body.reason).toBe("Not valid id !!")
            })
            .end(done);


    })

});

describe("PATCH /todo/:id",()=>{

    it("Should be to update as what it expected !!",(done)=>{
        //user 1
        let id = todoBody[1]._id;

        request.agent(app)
            .patch(`/todo/${id}`)
            .set("x-auth",userBody[1].tokens[0].token)
            .send({text:"hello,world",completed:true})
            .expect(200)
            .expect((res)=>{

                expect(res.body.result.text).toBe("hello,world")
                expect(res.body.result.completed).toBe(true)
                expect(res.body.result.completedAt).toBeA("number")

            })
            .end(done)

    })

    it("Should not be to update as what it expected !!",(done)=>{
        //user 1
        let id = todoBody[1]._id;

        request.agent(app)
            .patch(`/todo/${id}`)
            .set("x-auth",userBody[0].tokens[0].token)
            .send({text:"hello,world",completed:true})
            .expect(404)
            .end(done)

    })

    it("Should be to set activated time field to null !!",(done)=>{
        //user 2
        let id = todoBody[1]._id;

        request(app)
            .patch(`/todo/${id}`)
            .set("x-auth",userBody[1].tokens[0].token)
            .send({text:"hello,world",completed:false})
            .expect(200)
            .expect((res)=>{

                expect(res.body.result.text).toBe("hello,world")
                expect(res.body.result.completed).toBe(false)
                expect(res.body.result.completedAt).toNotExist();

            })
            .end(done)

    })

})

describe("GET user/me/",()=>{

    it("Should be return an authenticate user",(done)=>{
        request(app)
            .get("/user/me/")
            .set("x-auth",userBody[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(userBody[0]._id.toHexString())
                expect(res.body.email).toBe(userBody[0].email)
            })
            .end(done)
    });

    it("Should be return 401 in none authenticate user",(done)=>{
        request(app)
            .get("/user/me/")
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end(done)
    });

})

describe("POST user/",()=>{

    it ("Should be create a user",(done)=>{
        var email = "hussam@hot.com", password = 12345678910;
        request(app)
            .post("/user/")
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

                users.findOne({
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
            .post("/user/")
            .send({email,password})
            .expect(400)

            .end(done)
    })
    it("Should not create a user if the email is already exist",(done)=>{
        var email = userBody[0].email , password = "dsadasdsadasdasda";
        request(app)
            .post("/user/")
            .send({email,password})
            .expect(400)
            .end(done)
    })




})

describe("POST user/login",()=>{

    it ("Should login user and return auth token",(done)=>{
        request(app)
            .post("/user/login")
            .send(userBody[1])
            .expect(200)
            .expect((response)=>{
                expect(response.header['x-auth']).toExist;
            })
            .end((err,result)=>{

                if (err){
                    done(err)
                }

                users.findById(userBody[1]._id).then((res)=>{
                    expect(res.tokens[1]).toInclude({access:"auth",token:result.header['x-auth']})
                    done();
                }).catch((e)=>done(e))
            })
    })
    it ("Should reject invalid login",(done)=>{
        request(app)
            .post("/user/login")
            .send({email:userBody[1].email+"dsd",password:userBody[1].password})
            .expect(400)
            .expect((response)=>{
                expect(response.header['x-auth']).toNotExist;
            })
            .end((err,result)=>{

                if (err){
                    done(err)
                }

                users.findById(userBody[1]._id).then((res)=>{
                    expect(res.tokens.length).toBe(1)
                    done();
                })
            })

    })
})

describe("DELETE /user2/login/me",()=>{
    it("Should be remove an auth token after logout",(done)=>{
        let token = userBody[0].tokens[0].token;
        request(app)
            .delete("/user/me/token")
            .set("x-auth",token)
            .expect(200)
            .end((err,response)=>{

                if (err)
                    return done(err)

                users.findById(userBody[0]._id).then((result)=>{
                    expect(result.tokens.length).toBe(0)
                    done();
                }).catch((e)=>done(e))
            })
    })
})