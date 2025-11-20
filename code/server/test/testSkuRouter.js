'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const position = require("../models/Position");
const positionDB = require("../database/PositionDB");



const app = require('../server');
var agent = chai.request.agent(app);

const skuDB = require('../database/SkuDB');

describe("Test SKUs Api", () => {


    beforeEach(async () => {
        await skuDB.deleteSKUData();
        await positionDB.deletePositionData();
        await positionDB.createPosition(new position("800234543412", "8002", "3454", "3412", 1000, 1000, 300, 150));
    });
    //HAPPY
    newSku(201, "one sku", 10, 10, "first sku", 8.44, 15);
    getSkuList(200, "one sku", 10, 10, "first sku", 8.44, 15, "another sku", 20, 20, "second sku", 16.24, 20);
    getSkuByID(200, 1, "one sku", 10, 10, "first sku", 8.44, 15, "another sku", 20, 20, "second sku", 16.24, 20);
    updateSku(200, 1, "one sku", 10, 10, "first sku", 8.44, 15, "another sku", 20, 20, "second sku", 16.24, 20);
    updateSkuPosition(200, 1, "one sku", 10, 10, "first sku", 8.44, 15, "800234543412");
    deleteSku(204, 1, "one sku", 10, 10, "first sku", 8.44, 15);

    //WRONG
    newSku(422, "sku finta", undefined, 10, "first damaged sku", 8.40, 12);
    newSku(422, "sku finta", 10, undefined, "first damaged sku", 8.40, 12);
    newSku(422, "sku finta", 10, 10, "first damaged sku", undefined, 12);
    getSkuByID(404, 50, "one sku", 10, 10, "first sku", 8.44, 15, "another sku", 20, 20, "second sku", 16.24, 20);
    updateSku(404, 42, "one sku", 10, 10, "first sku", 8.44, 15, "another sku", 20, 20, "second sku", 16.24, 20);
    deleteSku(422, undefined, "one sku", 10, 10, "first sku", 8.44, 15);

    afterEach(async () => {
        await skuDB.deleteSKUData();
        await positionDB.deletePositionData();
    })


});



function newSku(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {


    it('adding a new Sku ', function (done) {


        if (weight !== undefined && volume !== undefined && price !== undefined) {
            let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity };
            agent.post("/api/sku")
                .send(sku)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else {
            agent.post("/api/sku").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}

function getSkuList(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity, description2, weight2, volume2, notes2, price2, availableQuantity2) {

    it("getting a sku List", function (done) {

        let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity };
        agent.post("/api/sku")
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                let sku2 = { description: description2, weight: weight2, volume: volume2, notes: notes2, price: price2, availableQuantity: availableQuantity2 };
                agent.post("/api/sku")
                    .send(sku2)
                    .then(function (r) {

                        r.should.have.status(201);

                        agent.get("/api/skus").then(function (ret) {

                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].description.should.equal(description);
                            ret.body[1].description.should.equal(description2);
                            ret.body[0].weight.should.equal(weight);
                            ret.body[1].weight.should.equal(weight2);
                            ret.body[0].volume.should.equal(volume);
                            ret.body[1].volume.should.equal(volume2);
                            ret.body[0].notes.should.equal(notes);
                            ret.body[1].notes.should.equal(notes2);
                            ret.body[0].price.should.equal(price);
                            ret.body[1].price.should.equal(price2);
                            ret.body[0].availableQuantity.should.equal(availableQuantity);
                            ret.body[1].availableQuantity.should.equal(availableQuantity2);
                            done();
                        });
                    });
            });
    });

}

function getSkuByID(expectedHTTPStatus, id, description, weight, volume, notes, price, availableQuantity) {

    it("getting a sku  by ID", function (done) {
        if (expectedHTTPStatus === 200) {
            let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity };
            agent.post("/api/sku")
                .send(sku)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get("/api/skus/" + id).then(function (r2) {

                        r2.should.have.status(expectedHTTPStatus);
                        r2.body.description.should.equal(description);
                        r2.body.weight.should.equal(weight);
                        r2.body.volume.should.equal(volume);
                        r2.body.notes.should.equal(notes);
                        r2.body.price.should.equal(price);
                        r2.body.availableQuantity.should.equal(availableQuantity);
                        done();
                    });

                });

        }
        else if (expectedHTTPStatus === 404) {
            agent.get("/api/sku/" + id).then(function (r2) {
                r2.should.have.status(expectedHTTPStatus);
                done();
            });
        }

    });
}


function updateSku(expectedHTTPStatus, id, description, weight, volume, notes, price, availableQuantity, description2, weight2, volume2, notes2, price2, availableQuantity2) {


    it("Updating a Sku", function (done) {
        if (expectedHTTPStatus === 200) {
            let sku = { id: id, description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity };
            agent.post("/api/sku")
                .send(sku)
                .then(function (res) {
                    res.should.have.status(201);
                    let newsku = { newDescription: description2, newWeight: weight2, newVolume: volume2, newNotes: notes2, newPrice: price2, newAvailableQuantity: availableQuantity2 };
                    agent.put("/api/sku/" + id)
                        .send(newsku)
                        .then(function (r) {
                            r.should.have.status(200);
                            done();

                        });
                });

        }
        else if (expectedHTTPStatus === 404) {
            let newsku = { newDescription: description2, newWeight: weight2, newVolume: volume2, newNotes: notes2, newPrice: price2, newAvailableQuantity: availableQuantity2 };
            agent.put("/api/sku/" + id)
                .send(newsku)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();

                });

        }
    });

}

function updateSkuPosition(expectedHTTPStatus, id, description, weight, volume, notes, price, availableQuantity, position) {


    it("Updating a Sku position", function (done) {
        if (expectedHTTPStatus === 200) {
            let sku = { id: id, description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity };
            agent.post("/api/sku")
                .send(sku)
                .then(function (res) {

                    res.should.have.status(201);
                    let pos = { position: position };

                    agent.put("/api/sku/" + id + "/position")
                        .send(pos)
                        .then(function (r) {

                            r.should.have.status(expectedHTTPStatus);
                            done();

                        });
                });

        }
        else if (expectedHTTPStatus === 404) {
            agent.get("/api/sku/" + id).then(function (r2) {
                r2.should.have.status(expectedHTTPStatus);
                done();
            });

        }
    });

}



function deleteSku(expectedHTTPStatus, id, description, weight, volume, notes, price, availableQuantity) {
    it("deleting a SKU", function (done) {

        if (id !== undefined) {
            let sku = { id: id, description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity };
            agent.post("/api/sku")
                .send(sku)
                .then(function (res) {

                    res.should.have.status(201);
                    agent.delete("/api/skus/" + id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })

                });
        }
        else {
            agent.delete("/api/skus/" + id)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })

        }

    });

}