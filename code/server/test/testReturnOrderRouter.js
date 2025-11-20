'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const userDB = require("../database/UserDB");
const restockOrderDB = require('../database/RestockOrderDB');
const returnOrderDB = require('../database//ReturnOrderDB');
const utilities = require('../utilities/validationUtils');


const app = require('../server');
const Sku = require('../models/Sku');
const User = require('../models/User');
const Restock_Order = require('../models/Restock_Order');
var agent = chai.request.agent(app);


describe("Test ReturnOrder Api", () => {


    beforeEach(async () => {
        await restockOrderDB.deleteRestockOrderData();
        await restockOrderDB.deleteSKUItemToRestockData();
        await restockOrderDB.deleteSKUToRestockData();
        await returnOrderDB.deleteReturnOrderData();
        await returnOrderDB.deleteItemsToReturnData();
        await userDB.deleteUserData();
        await userDB.createUser(new User(1, "jhon", "Smith", "prova@ezwh.com", "testpass", "supplier"));
        await restockOrderDB.createRestockOrder(new Restock_Order(1, "2021/11/29 09:33", "ISSUED", 1));
    });

    //HAPPY
    newReturnOrder(201, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }], 1);
    getReturnOrderList(200, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }], 1, 2, "2021/11/30 09:35", [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789015" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789039" }], 1)
    getReturnOrderByID(200, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }], 1)
    deleteReturnOrder(204, 1, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }], 1);

    //WRONG
    newReturnOrder(404, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }], 5);
    newReturnOrder(422, undefined, [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }], 1);
    newReturnOrder(422, "2021/11/29 09:33", undefined, 1);
    newReturnOrder(422, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }], undefined);
    getReturnOrderByID(404, 4, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }], 1)
    deleteReturnOrder(422, "a5", "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }], 1);


    afterEach(async () => {
        await restockOrderDB.deleteRestockOrderData();
        await restockOrderDB.deleteSKUItemToRestockData();
        await restockOrderDB.deleteSKUToRestockData();
        await returnOrderDB.deleteReturnOrderData();
        await returnOrderDB.deleteItemsToReturnData();
        await userDB.deleteUserData();
        await userDB.createUser(new User(1, "user1name", "user1surname", "user1@ezwh.com", "testpassword", "customer"));
        await userDB.createUser(new User(2, "qualityEmployee1name", "qualityEmployee1surname", "qualityEmployee1@ezwh.com", "testpassword", "qualityEmployee"));
        await userDB.createUser(new User(3, "clerk1name", "clerk1surname", "clerk1@ezwh.com", "testpassword", "clerk"));
        await userDB.createUser(new User(4, "deliveryEmployee1name", "deliveryEmployee1surname", "deliveryEmployee1@ezwh.com", "testpassword", "deliveryEmployee"));
        await userDB.createUser(new User(5, "supplier1name", "supplier1surname", "supplier1@ezwh.com", "testpassword", "supplier"));
        await userDB.createUser(new User(6, "manager1name", "manager1surname", "manager1@ezwh.com", "testpassword", "manager"));


    })
});

function newReturnOrder(expectedHTTPStatus, returnDate, products, restockOrderId) {


    it('adding a new ReturnOrder ', function (done) {


        if (returnDate !== undefined && products !== undefined && restockOrderId !== undefined && expectedHTTPStatus === 201) {
            let order = { returnDate: returnDate, products: products, restockOrderId: restockOrderId };
            agent.post("/api/returnOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else if (expectedHTTPStatus === 422) {
            agent.post("/api/returnOrder").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
        else {
            let order = { returnDate: returnDate, products: products, restockOrderId: restockOrderId };
            agent.post("/api/returnOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();

                })
        }
    });
}

function getReturnOrderList(expectedHTTPStatus, id, returnDate, products, restockOrderId, id2, returnDate2, products2, restockOrderId2) {

    it("getting a ReturnOrder List", function (done) {

        let order = { returnDate: returnDate, products: products, restockOrderId: restockOrderId };
        agent.post("/api/returnOrder")
            .send(order)
            .then(function (res) {
                let order2 = { returnDate: returnDate2, products: products2, restockOrderId: restockOrderId2 };
                agent.post("/api/returnOrder")
                    .send(order2)
                    .then(function (r) {
                        r.should.have.status(201);

                        agent.get("/api/returnOrders").then(function (ret) {

                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].id.should.equal(id);
                            ret.body[1].id.should.equal(id2);
                            ret.body[0].returnDate.should.equal(returnDate);
                            ret.body[1].returnDate.should.equal(returnDate2);
                            JSON.stringify(ret.body[0].products).should.equal(JSON.stringify(products));
                            JSON.stringify(ret.body[1].products).should.equal(JSON.stringify(products2));
                            ret.body[0].restockOrderId.should.equal(restockOrderId);
                            ret.body[1].restockOrderId.should.equal(restockOrderId2);

                            done();
                        });
                    });
            });
    });

}

function getReturnOrderByID(expectedHTTPStatus, id, returnDate, products, restockOrderId) {

    it("getting a ReturnOrder by ID", function (done) {
        if (expectedHTTPStatus === 200) {
            let order = { returnDate: returnDate, products: products, restockOrderId: restockOrderId };
            agent.post("/api/returnOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get("/api/returnOrders/" + id).then(function (r2) {

                        r2.should.have.status(expectedHTTPStatus);
                        r2.body.returnDate.should.equal(returnDate);
                        r2.body.id.should.equal(id);
                        JSON.stringify(r2.body.products).should.equal(JSON.stringify(products));
                        r2.body.restockOrderId.should.equal(restockOrderId);
                        done();
                    });

                });

        }
        else if (expectedHTTPStatus === 404) {
            agent.get("/api/returnOrders/" + id).then(function (r2) {
                r2.should.have.status(expectedHTTPStatus);
                done();
            });
        }

    });
}

function deleteReturnOrder(expectedHTTPStatus, id, returnDate, products, restockOrderId) {
    it("deleting a ReturnOrder", function (done) {

        if (id !== undefined) {
            let order = { returnDate: returnDate, products: products, restockOrderId: restockOrderId };
            agent.post("/api/returnOrder")
                .send(order)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete("/api/returnOrder/" + id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })

                });
        }
        else {
            agent.delete("/api/returnOrder/" + id)
                .then(function (r) {
                    console.log(r.status);
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })

        }

    });

}