'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const userDB = require("../database/UserDB");
const restockOrderDB = require('../database/RestockOrderDB');
const skuitemDB = require('../database/SkuItemDB');
const skuDB = require('../database/SkuDB');
const internalOrderDB = require('../database/InternalOrderDB');
const utilities = require('../utilities/validationUtils');


const app = require('../server');
const Sku = require('../models/Sku');
const Sku_item = require('../models/Sku_Item');
const User = require('../models/User');
const Restock_Order = require('../models/Restock_Order');
var agent = chai.request.agent(app);


describe("Test InternalOrder Api", () => {


    beforeEach(async () => {
        await skuDB.deleteSKUData();
        await skuitemDB.deleteSKUItemData();
        await internalOrderDB.deleteInternalOrderData();
        await internalOrderDB.deleteSkuItemToInternalData();
        await internalOrderDB.deleteSkuToInternalData();
        await userDB.deleteUserData();
        await userDB.createUser(new User(1, "jhon", "Smith", "prova@ezwh.com", "testpass", "customer"));
        await skuDB.createSku(new Sku(1, "a sku", 100, 100, "notes", 150, 2.40));
        await skuDB.createSku(new Sku(2, "another sku", 100, 100, "notes", 150, 2.40));
        await skuitemDB.createSkuItem(new Sku_item("12345678901234567890123456789016", 1, "2021/11/29 12:30"));
        await skuitemDB.createSkuItem(new Sku_item("12345678901234567890123456789038", 1, "2021/11/29 12:30"));
        await skuitemDB.createSkuItem(new Sku_item("12345678901234567890123456789039", 2, "2021/11/29 12:30"));

        await restockOrderDB.createRestockOrder(new Restock_Order(1, "2021/11/29 09:33", "ISSUED", 1));
    });
    //HAPPY
    newInternalOrder(201, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1);
    updateInternalOrderState(200, 1, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1, "COMPLETED", [{ "SkuID": 1, "RFID": "12345678901234567890123456789016" }, { "SkuID": 1, "RFID": "12345678901234567890123456789038" }]);
    getInternalOrderList(200, 1, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1,
        2, "2021/11/30 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
        { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1, "COMPLETED", [{ "SkuID": 1, "RFID": "12345678901234567890123456789016" }, { "SkuID": 2, "RFID": "12345678901234567890123456789039" }]
        , [{ "SKUId": 1, "description": "a product", "price": 11.99, "RFID": "12345678901234567890123456789016" }, { "SKUId": 2, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789039" }]);
    getInternalOrderIssued(200, 1, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1,
        2, "2021/11/30 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
        { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1);
    getInternalOrderAccepted(200, 1, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1,
        2, "2021/11/30 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
        { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1, "ACCEPTED");
    getInternalOrderByID(200, 1, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1)
    deleteInternalOrder(204, 1, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1);


    // //WRONG
    newInternalOrder(422, undefined, [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1);
    newInternalOrder(422, "2021/11/29 09:33", undefined, 1);
    newInternalOrder(422, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], undefined);
    getInternalOrderByID(404, 5, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1)
    getInternalOrderByID(422, "c5", "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1)

    afterEach(async () => {

        await skuDB.deleteSKUData();
        await skuitemDB.deleteSKUItemData();
        await internalOrderDB.deleteInternalOrderData();
        await internalOrderDB.deleteSkuItemToInternalData();
        await internalOrderDB.deleteSkuToInternalData();
        await userDB.deleteUserData();
        await userDB.createUser(new User(1, "user1name", "user1surname", "user1@ezwh.com", "testpassword", "customer"));
        await userDB.createUser(new User(2, "qualityEmployee1name", "qualityEmployee1surname", "qualityEmployee1@ezwh.com", "testpassword", "qualityEmployee"));
        await userDB.createUser(new User(3, "clerk1name", "clerk1surname", "clerk1@ezwh.com", "testpassword", "clerk"));
        await userDB.createUser(new User(4, "deliveryEmployee1name", "deliveryEmployee1surname", "deliveryEmployee1@ezwh.com", "testpassword", "deliveryEmployee"));
        await userDB.createUser(new User(5, "supplier1name", "supplier1surname", "supplier1@ezwh.com", "testpassword", "supplier"));
        await userDB.createUser(new User(6, "manager1name", "manager1surname", "manager1@ezwh.com", "testpassword", "manager"));

    })

});

function newInternalOrder(expectedHTTPStatus, issueDate, products, customerId) {


    it('adding a new Internal ', function (done) {


        if (issueDate !== undefined && products !== undefined && customerId !== undefined && expectedHTTPStatus === 201) {
            let order = { issueDate: issueDate, products: products, customerId: customerId };
            agent.post("/api/internalOrders")
                .send(order)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else if (expectedHTTPStatus === 422) {
            agent.post("/api/internalOrders").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}

function getInternalOrderList(expectedHTTPStatus, id, issueDate, products, customerId, id2, issueDate2, products2, customerId2, newState, newproducts, expected) {

    it("getting a InternalOrder List", function (done) {

        let order = { issueDate: issueDate, products: products, customerId: customerId };
        agent.post("/api/internalOrders")
            .send(order)
            .then(function (res) {

                res.should.have.status(201);
                let order2 = { issueDate: issueDate2, products: products2, customerId: customerId2 };
                agent.post("/api/internalOrders")
                    .send(order2)
                    .then(function (r) {

                        r.should.have.status(201);

                        let newStato = { newState: newState, products: newproducts };
                        agent.put("/api/internalOrders/" + id2)
                            .send(newStato)
                            .then(function (atm) {

                                atm.should.have.status(200);
                                agent.get("/api/internalOrders").then(function (ret) {
                                    ret.should.have.status(expectedHTTPStatus);
                                    ret.body[0].id.should.equal(id);
                                    ret.body[0].issueDate.should.equal(issueDate);
                                    ret.body[0].state.should.equal("ISSUED");

                                    JSON.stringify(ret.body[0].products).should.equal(JSON.stringify(products));

                                    ret.body[0].customerId.should.equal(customerId);

                                    ret.body[1].id.should.equal(id2);
                                    ret.body[1].issueDate.should.equal(issueDate2);

                                    ret.body[1].state.should.equal(newState);
                                    ret.body[1].customerId.should.equal(customerId2);

                                    JSON.stringify(ret.body[1].products).should.equal(JSON.stringify(expected));
                                    done();

                                });


                            });



                    });
            });
    });

}

function getInternalOrderIssued(expectedHTTPStatus, id, issueDate, products, customerId, id2, issueDate2, products2, customerId2) {

    it("getting a InternalOrder Issued List", function (done) {

        let order = { issueDate: issueDate, products: products, customerId: customerId };
        agent.post("/api/internalOrders")
            .send(order)
            .then(function (res) {

                res.should.have.status(201);
                let order2 = { issueDate: issueDate2, products: products2, customerId: customerId2 };
                agent.post("/api/internalOrders")
                    .send(order2)
                    .then(function (r) {

                        r.should.have.status(201);


                        agent.get("/api/internalOrdersIssued").then(function (ret) {
                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].id.should.equal(id);
                            ret.body[0].issueDate.should.equal(issueDate);
                            ret.body[0].state.should.equal("ISSUED")
                            JSON.stringify(ret.body[0].products).should.equal(JSON.stringify(products));

                            ret.body[0].customerId.should.equal(customerId);

                            ret.body[1].id.should.equal(id2);
                            ret.body[1].issueDate.should.equal(issueDate2);
                            ret.body[1].state.should.equal("ISSUED");
                            ret.body[1].customerId.should.equal(customerId2);

                            JSON.stringify(ret.body[1].products).should.equal(JSON.stringify(products2));
                            done();




                        });



                    });
            });
    });

}

function getInternalOrderAccepted(expectedHTTPStatus, id, issueDate, products, customerId, id2, issueDate2, products2, customerId2, newState) {

    it("getting a InternalOrder Accepted List", function (done) {

        let order = { issueDate: issueDate, products: products, customerId: customerId };
        agent.post("/api/internalOrders")
            .send(order)
            .then(function (res) {

                res.should.have.status(201);
                let order2 = { issueDate: issueDate2, products: products2, customerId: customerId2 };
                agent.post("/api/internalOrders")
                    .send(order2)
                    .then(function (r) {

                        r.should.have.status(201);

                        let newStato = { newState: newState };
                        agent.put("/api/internalOrders/" + id2)
                            .send(newStato)
                            .then(function (atm) {
                                atm.should.have.status(200);
                                agent.get("/api/internalOrdersAccepted").then(function (ret) {


                                    ret.should.have.status(expectedHTTPStatus);

                                    ret.body[0].id.should.equal(id2);

                                    ret.body[0].issueDate.should.equal(issueDate2);

                                    ret.body[0].state.should.equal("ACCEPTED")
                                    JSON.stringify(ret.body[0].products).should.equal(JSON.stringify(products2));
                                    ret.body[0].customerId.should.equal(customerId2);
                                    done();

                                });


                            });



                    });
            });
    });

}

function getInternalOrderByID(expectedHTTPStatus, id, issueDate, products, customerId) {

    it("getting a InternalOrder by ID", function (done) {
        if (expectedHTTPStatus === 200) {
            let order = { issueDate: issueDate, products: products, customerId: customerId };
            agent.post("/api/internalOrders")
                .send(order)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get("/api/internalOrders/" + id).then(function (r2) {
                        r2.should.have.status(expectedHTTPStatus);
                        r2.body.id.should.equal(id);
                        r2.body.issueDate.should.equal(issueDate);
                        r2.body.state.should.equal("ISSUED");
                        JSON.stringify(r2.body.products).should.equal(JSON.stringify(products));
                        r2.body.customerId.should.equal(customerId);
                        done();
                    });

                });

        }
        else if (expectedHTTPStatus === 404) {
            agent.get("/api/internalOrders/" + id).then(function (r2) {

                r2.should.have.status(expectedHTTPStatus);
                done();
            });
        }
        else if (expectedHTTPStatus == 422) {
            agent.get("/api/internalOrders/" + id).then(function (r2) {
                r2.should.have.status(expectedHTTPStatus);
                done();

            })
        }

    });
}


function updateInternalOrderState(expectedHTTPStatus, id, issueDate, products, customerId, newState, newproducts) {


    it("Updating a Internal State", function (done) {
        if (expectedHTTPStatus === 200) {
            let order = { issueDate: issueDate, products: products, customerId: customerId };
            agent.post("/api/internalOrders")
                .send(order)
                .then(function (res) {

                    res.should.have.status(201);
                    let newStato = { newState: newState, products: newproducts };
                    agent.put("/api/internalOrders/" + id)
                        .send(newStato)
                        .then(function (r) {
                            r.should.have.status(200);
                            done();

                        });
                });

        }
        else if (expectedHTTPStatus === 404 || expectedHTTPStatus == 422) {
            let newStato = { newState: newState, products: newproducts };
            agent.put("/api/internalOrders/" + id)
                .send(newStato)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();

                });

        }
    });

}

function deleteInternalOrder(expectedHTTPStatus, id, issueDate, products, customerId) {
    it("deleting an InternalOrder", function (done) {

        if (id !== undefined) {
            let order = { issueDate: issueDate, products: products, customerId: customerId };
            agent.post("/api/internalOrders")
                .send(order)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete("/api/internalOrders/" + id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })

                });
        }
        else {
            agent.delete("/api/internalOrders/" + id)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })

        }

    });

}
