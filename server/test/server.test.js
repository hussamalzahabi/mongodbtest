const expect = require("expect");
const request = require("supertest");
const {ObjectId} = require("mongodb")

const {app} = require("../server");
const {users} = require("../model/Users");

var userBody = [{_id: new ObjectId(), name: "hussam"}
               ,{_id: new ObjectId(), name: "layth"}];
beforeEach((done) => {

    users.remove({}).then((result) => {

        users.insertMany(userBody).then(() => {
            done();
        })


    })


})


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
            .expect((response)=>{
                expect(response.body.name).toBe(userBody[1].name)
            })
            .end(done)

    })

    it ("should be return 404 back which indicates that the id is not exists",(done)=>{

        request(app)
            .get(`/showuser/${id}`)
            .expect(404)
            .end(done)

    })

    it ("should be return 404 back which indicates that the id is not valid",(done)=>{

        request(app)
            .get(`/showuser/${id+"d"}`)
            .expect(404)
            .end(done)
    })


})


