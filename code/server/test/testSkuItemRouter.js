'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const Sku = require('../models/Sku');

const utilities = require('../utilities/validationUtils');


const app = require('../server');
var agent = chai.request.agent(app);

const skuItemDB = require('../database/SkuItemDB');
const skuDB = require('../database/SkuDB');


describe("Test SkuItem Apis", () => {


    beforeEach(async () => {
        await skuItemDB.deleteSKUItemData();
        await skuDB.deleteSKUData();
        await skuDB.createSku(new Sku(1, "Test Sku", 100, 50, "first SKU", 50, 10.99));
        await skuDB.createSku(new Sku(2, "Second Test Sku", 100, 50, "Second Sku", 150, 9.80));
    });

    //HAPPY CASE
    newSkuItem(201, "12345678901234567890123456789015", 1, "2021/11/29 12:30");
    getSkuItemList(200, "12345678901234567890123456789014", 1, "2021/11/29 12:30", "12345678901234567890123456789015", 1, "2021/11/29 12:30");
    getSkuItemByRFID(200, "12345678901234567890123456789015", 1, "2021/11/29 12:30");
    getSkuItemBySkuID(200, "12345678901234567890123456789015", 1, "2021/11/29 12:30");
    updateSkuItem(200, "12345678901234567890123456789015", 1, "2021/11/29 12:30", "12345678901234567890123456789016", 1, "2021/11/29 12:30");
    deleteSkuItem(204, "12345678901234567890123456789015", 1, "2021/11/29 12:30");

    //WRONG CASE
    newSkuItem(422, undefined, 1, "2021/11/29 12:30");
    newSkuItem(422, "12345678901234567890123456789015", undefined, "2021/11/29 12:30");
    newSkuItem(422, "12345678901234567890123456789015", 1, undefined);
    getSkuItemBySkuID(404, "12345678901234567890123456789015", 82, "2021/11/29 12:30");
    updateSkuItem(404, "12345678901234567890123456789015", 1, "2021/11/29 12:30", "12345678901234567890123456789016", 1, "2021/11/29 12:30");

    afterEach(async () => {
        await skuItemDB.deleteSKUItemData();
        await skuDB.deleteSKUData();
    })

});


function newSkuItem(expectedHTTPStatus, RFID, SKUId, DateOfStock) {


    it('adding a new Sku Item', function (done) {


        if (RFID !== undefined && SKUId !== undefined && DateOfStock !== undefined) {
            let skuitem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock };
            agent.post("/api/skuitem")
                .send(skuitem)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else {
            agent.post("/api/skuitem").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}



function getSkuItemList(expectedHTTPStatus, RFID, SKUId, DateOfStock, RFID2, SKUId2, DateOfStock2) {

    it("getting a sku item List", function (done) {

        let skuitem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock };
        agent.post("/api/skuitem")
            .send(skuitem)
            .then(function (res) {
                res.should.have.status(201);
                let skuitem2 = { RFID: RFID2, SKUId: SKUId2, DateOfStock: DateOfStock2 }
                agent.post("/api/skuitem")
                    .send(skuitem2)
                    .then(function (r) {

                        r.should.have.status(201);

                        agent.get("/api/skuitems").then(function (ret) {


                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].RFID.should.equal(RFID);
                            ret.body[1].RFID.should.equal(RFID2);
                            ret.body[0].SKUId.should.equal(SKUId);
                            ret.body[1].SKUId.should.equal(SKUId2);
                            ret.body[0].DateOfStock.should.equal(DateOfStock);
                            ret.body[1].DateOfStock.should.equal(DateOfStock2);


                            done();
                        });
                    });
            });
    });
}



function getSkuItemByRFID(expectedHTTPStatus, RFID, SKUId, DateOfStock) {

    it("getting a sku item by RFID", function (done) {

        let skuitem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock };
        agent.post("/api/skuitem")
            .send(skuitem)
            .then(function (res) {
                res.should.have.status(201);

                agent.get("/api/skuitems/" + RFID).then(function (r) {

                    r.should.have.status(expectedHTTPStatus);
                    r.body.RFID.should.equal(RFID);
                    r.body.SKUId.should.equal(SKUId);
                    r.body.DateOfStock.should.equal(DateOfStock);
                    done();
                });
            });

    });

}

//maybe its wrong
function getSkuItemBySkuID(expectedHTTPStatus, RFID, SKUId, DateOfStock) {

    it("getting a sku item by ID", function (done) {
        if (expectedHTTPStatus === 200) {
            let skuitem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock };
            agent.post("/api/skuitem")
                .send(skuitem)
                .then(function (res) {
                    res.should.have.status(201);
                    let newskuitem = { newRFID: RFID, newAvailable: 1, newDateOfStock: DateOfStock };
                    agent.put("/api/skuitems/" + RFID)
                        .send(newskuitem)
                        .then(function (r) {

                            r.should.have.status(200);

                            agent.get("/api/skuitems/sku/" + SKUId).then(function (r2) {

                                r2.should.have.status(expectedHTTPStatus);
                                r2.body.length.should.equal(1);
                                r2.body[0].RFID.should.equal(RFID);

                                r2.body[0].SKUId.should.equal(SKUId);
                                r2.body[0].DateOfStock.should.equal(DateOfStock);
                                done();
                            });

                        });

                });
        }
        else if (expectedHTTPStatus === 404) {

            agent.get("/api/skuitems/sku/" + SKUId).then(function (r2) {
                r2.should.have.status(expectedHTTPStatus);
                done();
            });
        }

    });

}

function updateSkuItem(expectedHTTPStatus, RFID, SKUId, DateOfStock, newRFID, newAvaiable, newDateOfStock) {


    it("updating a sku item", function (done) {
        if (expectedHTTPStatus === 200) {
            let skuitem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock };
            agent.post("/api/skuitem")
                .send(skuitem)
                .then(function (res) {
                    res.should.have.status(201);
                    let newskuitem = { newRFID: newRFID, newAvailable: newAvaiable, newDateOfStock: newDateOfStock };
                    agent.put("/api/skuitems/" + RFID)
                        .send(newskuitem)
                        .then(function (r) {
                            r.should.have.status(200);
                            done();

                        });
                });

        }
        else if (expectedHTTPStatus === 404) {
            agent.get("/api/skuitems/" + RFID).then(function (r2) {
                r2.should.have.status(expectedHTTPStatus);
                done();
            });

        }
    });

}

function deleteSkuItem(expectedHTTPStatus, RFID, SKUId, DateOfStock) {
    it("deleting a SKUItem", function (done) {


        let skuitem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock };
        agent.post("/api/skuitem")
            .send(skuitem)
            .then(function (res) {

                res.should.have.status(201);
                agent.delete("/api/skuitems/" + RFID)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    })

            });

    });

}
