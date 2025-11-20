'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const userDB = require("../database/UserDB");
const utilities = require('../utilities/validationUtils');
const app = require('../server');
const user = require('../models/User');
var agent = chai.request.agent(app);


describe("Test User Api", () => {


    beforeEach(async () => {
        await userDB.deleteUserData();
        await userDB.createUser(new user(1, "jhon", "Smith", "prova@ezwh.com", "testpass", "customer"));
    });

    //HAPPY
    newUser(201, "user1@ezwh.com", "John", "Smith", "testpassword", "customer");
    getUserList(200, 2, "prova2@ezwh.com", "Pippo", "Donald", "donaldpass", "customer", 3, "prova3@ezwh.com", "Goofy", "Paperino", "goofypass", "customer");
    getSupplierList(200, 2, "prova2@ezwh.com", "Pippo", "Donald", "donaldpass", 3, "prova3@ezwh.com", "Goofy", "Paperino", "goofypass")
    updateUser(200, 2, "prova2@ezwh.com", "Pippo", "Donald", "donaldpass", "customer", "supplier");
    deleteUser(204, "prova2@ezwh.com", "Pippo", "Donald", "donaldpass", "customer");
    //WRONG
    newUser(409, "prova@ezwh.com", "Pippo", "Donald", "donaldpass", "customer");
    newUser(422, "prova2@ezwh.com", undefined, undefined, "donaldpass", "customer");
    newUser(422, "prova3@ezwh.com", "Pippo", "Donald", "donaldpass", "manager");
    updateUser(404, 2, "prova2@ezwh.com", "Pippo", "Donald", "donaldpass", undefined, "supplier");

    loginUser(200, "user1@ezwh.com", "John", "Smith", "testpassword", "customer");
    loginUser(401, "user1@ezwh.com", "John", "Smith", "testpassword", "clerk");

    deleteUser(204, "provaaaa@ezwh.com", "Pippo", "Donald", "donaldpass", "customer");
    deleteUser(422, "provaaaa@ezwh.com", "Pippo", "Donald", "donaldpass", "manager"); //cannot delete a manager
    deleteUser(422, undefined, "Pippo", "Donald", "donaldpass", "manager"); //email cannot be undefined

    logout();

    afterEach(async () => {
        await userDB.deleteUserData();
        await userDB.createUser(new user(1, "user1name", "user1surname", "user1@ezwh.com", "testpassword", "customer"));
        await userDB.createUser(new user(2, "qualityEmployee1name", "qualityEmployee1surname", "qualityEmployee1@ezwh.com", "testpassword", "qualityEmployee"));
        await userDB.createUser(new user(3, "clerk1name", "clerk1surname", "clerk1@ezwh.com", "testpassword", "clerk"));
        await userDB.createUser(new user(4, "deliveryEmployee1name", "deliveryEmployee1surname", "deliveryEmployee1@ezwh.com", "testpassword", "deliveryEmployee"));
        await userDB.createUser(new user(5, "supplier1name", "supplier1surname", "supplier1@ezwh.com", "testpassword", "supplier"));
        await userDB.createUser(new user(6, "manager1name", "manager1surname", "manager1@ezwh.com", "testpassword", "manager"));

    })

});


//TODO: GET ->/api/userinfo come scrivo il test per far loggare l'user? Non si può ora che non abbiamo le sessions


function newUser(expectedHTTPStatus, username, name, surname, password, type) {


    it('adding a new User ', function (done) {


        if (username !== undefined && name !== undefined && surname !== undefined && password !== undefined && type !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type };
            agent.post("/api/newUser")
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else {
            agent.post("/api/newUser").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}

//ATTENTION: the index are 1-2 on the body response because there is a fake user inserted only for 409 errors!
function getUserList(expectedHTTPStatus, id, username, name, surname, password, type, id2, username2, name2, surname2, password2, type2) {

    it("getting a User List", function (done) {

        let user = { username: username, name: name, surname: surname, password: password, type: type };
        agent.post("/api/newUser")
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                let user2 = { username: username2, name: name2, surname: surname2, password: password2, type: type2 };
                agent.post("/api/newUser")
                    .send(user2)
                    .then(function (r) {
                        r.should.have.status(201);
                        agent.get("/api/users").then(function (ret) {

                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[1].email.should.equal(username);
                            ret.body[2].email.should.equal(username2);
                            ret.body[1].name.should.equal(name);
                            ret.body[2].name.should.equal(name2);
                            ret.body[1].surname.should.equal(surname);
                            ret.body[2].surname.should.equal(surname2);
                            ret.body[1].id.should.equal(id);
                            ret.body[2].id.should.equal(id2);
                            ret.body[1].type.should.equal(type);
                            ret.body[2].type.should.equal(type2);
                            done();
                        });
                    });
            });
    });

}

function getSupplierList(expectedHTTPStatus, id, username, name, surname, password, id2, username2, name2, surname2, password2) {

    it("getting a Supplier List", function (done) {

        let user = { username: username, name: name, surname: surname, password: password, type: "supplier" };
        agent.post("/api/newUser")
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                let user2 = { username: username2, name: name2, surname: surname2, password: password2, type: "supplier" };
                agent.post("/api/newUser")
                    .send(user2)
                    .then(function (r) {
                        r.should.have.status(201);
                        agent.get("/api/suppliers").then(function (ret) {

                            ret.should.have.status(expectedHTTPStatus);

                            ret.body[0].email.should.equal(username);
                            ret.body[1].email.should.equal(username2);

                            ret.body[0].name.should.equal(name);
                            ret.body[1].name.should.equal(name2);
                            ret.body[0].surname.should.equal(surname);
                            ret.body[1].surname.should.equal(surname2);
                            ret.body[0].id.should.equal(id);
                            ret.body[1].id.should.equal(id2);
                            done();
                        });
                    });
            });
    });

}

function updateUser(expectedHTTPStatus, id, username, name, surname, password, oldType, newType) {


    it("Updating a User", function (done) {
        if (expectedHTTPStatus === 200) {
            let user = { username: username, name: name, surname: surname, password: password, type: oldType };
            agent.post("/api/newUser")
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let newtype = { oldType: oldType, newType: newType };
                    agent.put("/api/users/" + username)
                        .send(newtype)
                        .then(function (r) {
                            r.should.have.status(200);
                            done();

                        });
                });

        }
        else if (expectedHTTPStatus === 404) {
            let newtype = { oldType: oldType, newType: newType };
            agent.put("/api/users/" + username)
                .send(newtype)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();

                });

        }
    });

}

function deleteUser(expectedHTTPStatus, username, name, surname, password, type) {
    it("deleting a User", function (done) {

        if (utilities.validate_string_value(username) && expectedHTTPStatus === 204) {
            let user = { username: username, name: name, surname: surname, password: password, type: type };
            agent.post("/api/newUser")
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete("/api/users/" + username + "/" + type)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })

                });
        }
        else if (expectedHTTPStatus === 422) {
            agent.delete("/api/users/" + username + "/" + type)
                .then(function (r) {
                    r.should.have.status(422);
                    done();
                })

        }
        else {
            agent.delete("/api/users/" + username + "/" + type)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })
        }

    });

}


function logout() {

    it("logout a user", function (done) {
        agent.post("/api/logout")
            .send()
            .then(function (res) {
                res.should.have.status(200);
                done();
            });
    });

}

function loginUser(expectedHTTPStatus, username, name, surname, password, type) {
    it("logging a User", function (done) {

        if (utilities.validate_string_value(username) && utilities.validate_password_value(password)) {
            let user = { username: username, name: name, surname: surname, password: password, type: type };
            agent.post("/api/newUser")
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let credentials = { username: username, password: password };
                    agent.post("/api/customerSessions")
                        .send(credentials)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });
        }
        /*else if (expectedHTTPStatus === 422) {
            agent.delete("/api/users/" + username + "/" + type)
                .then(function (r) {
                    r.should.have.status(422);
                    done();
                })

        }
        else {
            agent.delete("/api/users/" + username + "/" + type)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })
        }*/

    });

}