'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const userDB = require("../database/UserDB");
const skuDB = require('../database/SkuDB');
const itemDB = require('../database/ItemDB');

const utilities = require('../utilities/validationUtils');


const app = require('../server');
const Sku = require('../models/Sku');
const User = require('../models/User');
var agent = chai.request.agent(app);


describe("Test Item Api", () => {


    beforeEach(async () => {
        await itemDB.deleteItemData();
        await skuDB.deleteSKUData();
        await skuDB.createSku(new Sku(1, "a new sku", 100, 50, "a sku", 50, 9.99));
        await userDB.deleteUserData();
        await userDB.createUser(new User(1, "jhon", "Smith", "prova@ezwh.com", "testpass", "supplier"));
        await userDB.createUser(new User(2, "Jack", "Sparrow", "prova2@ezwh.com", "testpass2", "supplier"));
    });

    //HAPPY
    newItem(201, 1, "an item", 41.24, 1, 2);
    getItemList(200, 1, "an item", 23.1, 1, 1, 2, "another item", 31.4, 1, 2);
    getItemByID(200, 1, "an item", 41.24, 1, 2);
    updateItem(200, 1, "an item", 41.24, 1, 2, "a new sku", 10.99);
    deleteItem(204, 1, "an item", 41.24, 1, 2);

    //WRONG
    newItem(404, 1, "an item", 3.21, 5, 2);
    newItem(422, undefined, "an item", 23.3, 1, 4);
    newItem(422, 1, undefined, 2.3, 1, 1);
    newItem(422, 1, "an item", undefined, 1, 1);
    newItem(422, 1, "an item", 2.3, undefined, 1);
    newItem(422, 1, "an item", 2.3, 1, undefined);
    getItemByID(404, 4, "an item", 41.24, 1, 2);
    updateItem(404, 2, "an item", 41.24, 1, 2, "a new sku", 10.99);
    updateItem(422, 2, "an item", 41.24, 1, 2, undefined, 10.99);
    updateItem(422, 2, "an item", 41.24, 1, 2, "a new sku", undefined);

    afterEach(async () => {
        await itemDB.deleteItemData();
        await skuDB.deleteSKUData();
        await userDB.deleteUserData();
        await userDB.createUser(new User(1, "user1name", "user1surname", "user1@ezwh.com", "testpassword", "customer"));
        await userDB.createUser(new User(2, "qualityEmployee1name", "qualityEmployee1surname", "qualityEmployee1@ezwh.com", "testpassword", "qualityEmployee"));
        await userDB.createUser(new User(3, "clerk1name", "clerk1surname", "clerk1@ezwh.com", "testpassword", "clerk"));
        await userDB.createUser(new User(4, "deliveryEmployee1name", "deliveryEmployee1surname", "deliveryEmployee1@ezwh.com", "testpassword", "deliveryEmployee"));
        await userDB.createUser(new User(5, "supplier1name", "supplier1surname", "supplier1@ezwh.com", "testpassword", "supplier"));
        await userDB.createUser(new User(6, "manager1name", "manager1surname", "manager1@ezwh.com", "testpassword", "manager"));

    });


});

function newItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {


    it('adding a new Item ', function (done) {


        if (id !== undefined && description !== undefined && price !== undefined && SKUId !== undefined && supplierId !== undefined) {
            let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
            agent.post("/api/item")
                .send(item)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else {
            agent.post("/api/item").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}

function getItemList(expectedHTTPStatus, id, description, price, SKUId, supplierId, id2, description2, price2, SKUId2, supplierId2) {

    it("getting a Item List", function (done) {

        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
        agent.post("/api/item")
            .send(item)
            .then(function (res) {
                res.should.have.status(201);
                let item2 = { id: id2, description: description2, price: price2, SKUId: SKUId2, supplierId: supplierId2 };
                agent.post("/api/item")
                    .send(item2)
                    .then(function (r) {
                        r.should.have.status(201);

                        agent.get("/api/items").then(function (ret) {

                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].id.should.equal(id);
                            ret.body[1].id.should.equal(id2);
                            ret.body[0].description.should.equal(description);
                            ret.body[1].description.should.equal(description2);
                            ret.body[0].price.should.equal(price);
                            ret.body[1].price.should.equal(price2);
                            ret.body[0].SKUId.should.equal(SKUId);
                            ret.body[1].SKUId.should.equal(SKUId2);
                            ret.body[0].supplierId.should.equal(supplierId);
                            ret.body[1].supplierId.should.equal(supplierId2);
                            done();
                        });
                    });
            });
    });

}

function getItemByID(expectedHTTPStatus, id, description, price, SKUId, supplierId) {

    it("getting a Item by ID", function (done) {
        if (expectedHTTPStatus === 200) {
            let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
            agent.post("/api/item")
                .send(item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get("/api/items/" + id).then(function (r2) {

                        r2.should.have.status(expectedHTTPStatus);
                        r2.body.id.should.equal(id);
                        r2.body.description.should.equal(description);
                        r2.body.price.should.equal(price);
                        r2.body.SKUId.should.equal(SKUId);
                        r2.body.supplierId.should.equal(supplierId);
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

function updateItem(expectedHTTPStatus, id, description, price, SKUId, supplierId, newDescription, newPrice) {


    it("Updating an Item", function (done) {
        if (expectedHTTPStatus === 200) {
            let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
            agent.post("/api/item")
                .send(item)
                .then(function (res) {
                    res.should.have.status(201);
                    let newItem = { newDescription: newDescription, newPrice: newPrice };
                    agent.put("/api/item/" + id)
                        .send(newItem)
                        .then(function (r) {
                            r.should.have.status(200);
                            done();

                        });
                });

        }
        else if (expectedHTTPStatus === 404 || expectedHTTPStatus == 422) {
            let newItem = { newDescription: newDescription, newPrice: newPrice };
            agent.put("/api/item/" + id)
                .send(newItem)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();

                });

        }
    });

}

function deleteItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it("deleting an Item", function (done) {

        if (id !== undefined) {
            let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
            agent.post("/api/item")
                .send(item)
                .then(function (res) {

                    res.should.have.status(201);
                    agent.delete("/api/items/" + id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })

                });
        }
        else {
            agent.delete("/api/items/" + id)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })

        }

    });

}

