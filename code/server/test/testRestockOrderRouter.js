'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const userDB = require("../database/UserDB");
const restockOrderDB = require('../database/RestockOrderDB');
const utilities = require('../utilities/validationUtils');


const app = require('../server');
const Sku = require('../models/Sku');
const User = require('../models/User');
var agent = chai.request.agent(app);


describe("Test RestockOrder Api", () => {


    beforeEach(async () => {
        await restockOrderDB.deleteRestockOrderData();
        await restockOrderDB.deleteSKUItemToRestockData();
        await restockOrderDB.deleteSKUToRestockData();

        await userDB.deleteUserData();
        await userDB.createUser(new User(1, "jhon", "Smith", "prova@ezwh.com", "testpass", "supplier"));
    });

    //HAPPY
    newRestockOrder(201, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1)
    updateRestockOrderState(200, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1, "DELIVERED");
    updateRestockOrderTransportNote(200, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1, { "deliveryDate": "2021/12/29" })
    updateRestockOrderSkuItems(200, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1, [{ "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }]);
    getRestockOrderList(200, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1,
        "2021/11/30 09:40", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1)
    getRestockOrderIssued(200, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1,
        "2021/11/30 09:40", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1)
    getRestockOrderByID(200, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1);
    deleteRestockOrder(204, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1);


    //WRONG
    newRestockOrder(422, undefined, [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1)
    newRestockOrder(422, "2021/11/29 09:33", undefined, 1);
    newRestockOrder(422, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], undefined);
    updateRestockOrderState(404, 5, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1, "DELIVERED");
    updateRestockOrderState(422, 5, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1, undefined);
    updateRestockOrderTransportNote(404, 5, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1, { "deliveryDate": "2021/12/29" })
    updateRestockOrderTransportNote(422, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1, undefined);
    updateRestockOrderSkuItems(404, 5, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1, [{ "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }]);
    updateRestockOrderSkuItems(422, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1, undefined);
    deleteRestockOrder(404, 5, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1);
    deleteRestockOrder(422, "a5", "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1);





    afterEach(async () => {
        await restockOrderDB.deleteRestockOrderData();
        await restockOrderDB.deleteSKUItemToRestockData();
        await restockOrderDB.deleteSKUToRestockData();
        await userDB.deleteUserData();
        await userDB.createUser(new User(1, "user1name", "user1surname", "user1@ezwh.com", "testpassword", "customer"));
        await userDB.createUser(new User(2, "qualityEmployee1name", "qualityEmployee1surname", "qualityEmployee1@ezwh.com", "testpassword", "qualityEmployee"));
        await userDB.createUser(new User(3, "clerk1name", "clerk1surname", "clerk1@ezwh.com", "testpassword", "clerk"));
        await userDB.createUser(new User(4, "deliveryEmployee1name", "deliveryEmployee1surname", "deliveryEmployee1@ezwh.com", "testpassword", "deliveryEmployee"));
        await userDB.createUser(new User(5, "supplier1name", "supplier1surname", "supplier1@ezwh.com", "testpassword", "supplier"));
        await userDB.createUser(new User(6, "manager1name", "manager1surname", "manager1@ezwh.com", "testpassword", "manager"));

    })






});

function newRestockOrder(expectedHTTPStatus, issueDate, products, supplierId) {


    it('adding a new RestockOrder ', function (done) {


        if (issueDate !== undefined && products !== undefined && supplierId !== undefined) {
            let order = { issueDate: issueDate, products: products, supplierId: supplierId };
            agent.post("/api/restockOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else {
            agent.post("/api/restockOrder").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}

function getRestockOrderList(expectedHTTPStatus, issueDate, products, supplierId, issueDate2, products2, supplierId2) {

    it("getting a RestockOrder List", function (done) {

        let order = { issueDate: issueDate, products: products, supplierId: supplierId };
        agent.post("/api/restockOrder")
            .send(order)
            .then(function (res) {
                res.should.have.status(201);
                let order2 = { issueDate: issueDate2, products: products2, supplierId: supplierId2 };
                agent.post("/api/restockOrder")
                    .send(order2)
                    .then(function (r) {

                        r.should.have.status(201);

                        agent.get("/api/restockOrders").then(function (ret) {
                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].id.should.equal(1);
                            ret.body[1].id.should.equal(2);
                            ret.body[1].issueDate.should.equal(issueDate2);

                            ret.body[0].state.should.equal("ISSUED");
                            ret.body[1].state.should.equal("ISSUED");
                            JSON.stringify(ret.body[0].products).should.equal(JSON.stringify(products));
                            JSON.stringify(ret.body[1].products).should.equal(JSON.stringify(products2));
                            ret.body[0].supplierId.should.equal(supplierId);
                            ret.body[1].supplierId.should.equal(supplierId2);
                            JSON.stringify(ret.body[0].skuItems).should.equal(JSON.stringify([]));
                            JSON.stringify(ret.body[1].skuItems).should.equal(JSON.stringify([]));
                            done();
                        });
                    });
            });
    });

}

function getRestockOrderIssued(expectedHTTPStatus, issueDate, products, supplierId, issueDate2, products2, supplierId2) {

    it("getting a RestockOrder ISSUED", function (done) {

        let order = { issueDate: issueDate, products: products, supplierId: supplierId };
        agent.post("/api/restockOrder")
            .send(order)
            .then(function (res) {
                res.should.have.status(201);
                let order2 = { issueDate: issueDate2, products: products2, supplierId: supplierId2 };
                agent.post("/api/restockOrder")
                    .send(order2)
                    .then(function (r) {

                        r.should.have.status(201);

                        agent.get("/api/restockOrdersIssued").then(function (ret) {
                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].id.should.equal(1);
                            ret.body[1].id.should.equal(2);
                            ret.body[1].issueDate.should.equal(issueDate2);

                            ret.body[0].state.should.equal("ISSUED");
                            ret.body[1].state.should.equal("ISSUED");
                            JSON.stringify(ret.body[0].products).should.equal(JSON.stringify(products));
                            JSON.stringify(ret.body[1].products).should.equal(JSON.stringify(products2));
                            ret.body[0].supplierId.should.equal(supplierId);
                            ret.body[1].supplierId.should.equal(supplierId2);
                            JSON.stringify(ret.body[0].skuItems).should.equal(JSON.stringify([]));
                            JSON.stringify(ret.body[1].skuItems).should.equal(JSON.stringify([]));
                            done();
                        });
                    });
            });
    });

}

function getRestockOrderByID(expectedHTTPStatus, id, issueDate, products, supplierId) {

    it("getting a RestockOrder by ID", function (done) {
        if (expectedHTTPStatus === 200) {
            let order = { issueDate: issueDate, products: products, supplierId: supplierId };
            agent.post("/api/restockOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get("/api/restockOrders/" + id).then(function (r2) {
                        r2.should.have.status(expectedHTTPStatus);
                        r2.body.id.should.equal(id);
                        r2.body.issueDate.should.equal(issueDate);
                        r2.body.state.should.equal("ISSUED");
                        JSON.stringify(r2.body.products).should.equal(JSON.stringify(products));
                        r2.body.supplierId.should.equal(supplierId);
                        JSON.stringify(r2.body.skuItems).should.equal(JSON.stringify([]));

                        done();
                    });

                });

        }
        else if (expectedHTTPStatus === 404) {
            agent.get("/api/items/" + id).then(function (r2) {
                r2.should.have.status(expectedHTTPStatus);
                done();
            });
        }

    });
}




function updateRestockOrderState(expectedHTTPStatus, id, issueDate, products, supplierId, newState) {


    it("Updating a RestockOrder State", function (done) {
        if (expectedHTTPStatus === 200) {
            let order = { issueDate: issueDate, products: products, supplierId: supplierId };
            agent.post("/api/restockOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(201);
                    let newStato = { newState: newState };
                    agent.put("/api/restockOrder/" + id)
                        .send(newStato)
                        .then(function (r) {
                            r.should.have.status(200);
                            done();

                        });
                });

        }
        else if (expectedHTTPStatus === 404 || expectedHTTPStatus == 422) {
            let newStato = { newState: newState };
            agent.put("/api/restockOrder/" + id)
                .send(newStato)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();

                });

        }
    });

}

function updateRestockOrderSkuItems(expectedHTTPStatus, id, issueDate, products, supplierId, skuItems) {


    it("Updating a RestockOrder TransportNote", function (done) {
        if (expectedHTTPStatus === 200) {
            let order = { issueDate: issueDate, products: products, supplierId: supplierId };
            agent.post("/api/restockOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(201);
                    let newStato = { newState: "DELIVERED" };
                    agent.put("/api/restockOrder/" + id)
                        .send(newStato)
                        .then(function (r) {
                            r.should.have.status(200);

                            let items = { skuItems: skuItems };
                            agent.put("/api/restockOrder/" + id + "/skuItems")
                                .send(items)
                                .then(function (last) {

                                    last.should.have.status(200);
                                    done();
                                })



                        });
                });

        }
        else if (expectedHTTPStatus === 404 || expectedHTTPStatus == 422) {
            let items = { skuItems: skuItems };
            agent.put("/api/restockOrder/" + id + "/skuItems")
                .send(items)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();

                });

        }
    });

}


function updateRestockOrderTransportNote(expectedHTTPStatus, id, issueDate, products, supplierId, transportNote) {


    it("Updating a RestockOrder TransportNote", function (done) {
        if (expectedHTTPStatus === 200) {
            let order = { issueDate: issueDate, products: products, supplierId: supplierId };
            agent.post("/api/restockOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(201);
                    let newStato = { newState: "DELIVERY" };
                    agent.put("/api/restockOrder/" + id)
                        .send(newStato)
                        .then(function (r) {
                            r.should.have.status(200);

                            let transport = { transportNote: transportNote };
                            agent.put("/api/restockOrder/" + id + "/transportNote")
                                .send(transport)
                                .then(function (last) {

                                    last.should.have.status(200);
                                    done();
                                })



                        });
                });

        }
        else if (expectedHTTPStatus === 404 || expectedHTTPStatus == 422) {
            let transport = { transportNote: transportNote };
            agent.put("/api/restockOrder/" + id + "/transportNote")
                .send(transport)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();

                });

        }
    });

}

function deleteRestockOrder(expectedHTTPStatus, id, issueDate, products, supplierId) {
    it("deleting a RestockOrder", function (done) {

        if (id !== undefined) {
            let order = { issueDate: issueDate, products: products, supplierId: supplierId };
            agent.post("/api/restockOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete("/api/restockOrder/" + id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })

                });
        }
        else {
            agent.delete("/api/restockOrder" + id)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })

        }

    });

}
