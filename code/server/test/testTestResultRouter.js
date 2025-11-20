'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const skuDB = require('../database/SkuDB');
const testDescriptorDB = require('../database/TestDescriptorDB');
const testResultDB = require('../database/TestResultDB');
const skuItemDB = require('../database/SkuItemDB');


const app = require('../server');
const Sku = require('../models/Sku');
const test_descriptor = require('../models/Test_Descriptor');
const Sku_item = require('../models/Sku_Item');
var agent = chai.request.agent(app);


describe("Test TestResult Api", () => {


    beforeEach(async () => {
        await skuDB.deleteSKUData();
        await skuItemDB.deleteSKUItemData();
        await testDescriptorDB.deleteTestDescriptorData();
        await testResultDB.deleteTestResultData();
        await skuDB.createSku(new Sku(1, "a new sku", 100, 50, "a sku", 50, 9.99));
        await testDescriptorDB.createTestDescriptor(new test_descriptor(1, "test descriptor 12", "This test is described by12.", 1));
        await testDescriptorDB.createTestDescriptor(new test_descriptor(2, "test descriptor 14", "This test is described by14.", 1));
        await skuItemDB.createSkuItem(new Sku_item("12345678901234567890123456789016", 1, "2021/11/29 12:30", 1));

    });

    //HAPPY
    newTestResult(201, 1, 1, "2021/11/28", true, "12345678901234567890123456789016");
    getTestResultList(200, 1, 1, "2021/11/28", true, "12345678901234567890123456789016", 2, 2, "2021/11/28", false, "12345678901234567890123456789016");
    getTesResultByID(200, 1, 1, "2021/11/28", false, "12345678901234567890123456789016");
    updateTestResult(200, 1, 1, "2021/11/28", false, "12345678901234567890123456789016", 2, "2021/11/29", true);
    deleteTestResult(204, 1, 1, "2021/11/28", false, "12345678901234567890123456789016");
    //WRONG
    newTestResult(404, 1, 12, "2021/11/28", true, "12345678901234567890123456789016");
    newTestResult(422, undefined, 1, "2021/11/28", true, "12345678901234567890123456789016");
    newTestResult(422, 1, undefined, "2021/11/28", true, "12345678901234567890123456789016");
    newTestResult(422, 1, 1, undefined, true, "12345678901234567890123456789016");
    newTestResult(422, 1, 1, "2021/11/28", undefined, "12345678901234567890123456789016");
    newTestResult(422, 1, 1, "2021/11/28", true, undefined);
    getTesResultByID(404, 1, 12, "2021/11/28", true, "12345678901234567890123456789016"); //wrong testresultID
    getTesResultByID(404, 1, 1, "2021/11/28", true, "12345678901234567890123456789014"); //wrong RFID
    updateTestResult(404, 1, 4, "2021/11/28", false, "12345678901234567890123456789016", 2, "2021/11/29", true) //false testdescriptor id
    deleteTestResult(422, undefined, 1, "2021/11/28", false, "12345678901234567890123456789016");


    afterEach(async () => {

        await skuDB.deleteSKUData();
        await skuItemDB.deleteSKUItemData();
        await testDescriptorDB.deleteTestDescriptorData();
        await testResultDB.deleteTestResultData();
    })

});


function newTestResult(expectedHTTPStatus, id, idTestDescriptor, Date, Result, rfid) {


    it('adding a new TestResult ', function (done) {


        if (id !== undefined && idTestDescriptor !== undefined && Date !== undefined && Result !== undefined && rfid !== undefined) {
            let test = { id: id, rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result };
            agent.post("/api/skuitems/testResult")
                .send(test)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else {
            agent.post("/api/skuitems/testResult").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}


function getTestResultList(expectedHTTPStatus, id, idTestDescriptor, Date, Result, rfid, id2, idTestDescriptor2, Date2, Result2, rfid2) {

    it("getting a TestResult List", function (done) {

        let test = { id: id, rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result };
        agent.post("/api/skuitems/testResult")
            .send(test)
            .then(function (res) {
                res.should.have.status(201);
                let test2 = { id: id2, rfid: rfid2, idTestDescriptor: idTestDescriptor2, Date: Date2, Result: Result2 };
                agent.post("/api/skuitems/testResult")
                    .send(test2)
                    .then(function (r) {
                        r.should.have.status(201);

                        agent.get("/api/skuitems/" + rfid + "/testResults").then(function (ret) {

                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].id.should.equal(id);
                            ret.body[1].id.should.equal(id2);
                            ret.body[0].idTestDescriptor.should.equal(idTestDescriptor);
                            ret.body[1].idTestDescriptor.should.equal(idTestDescriptor2);
                            ret.body[0].Date.should.equal(Date);
                            ret.body[1].Date.should.equal(Date);
                            ret.body[0].Result.should.equal(Result);
                            ret.body[1].Result.should.equal(Result2);
                            done();
                        });
                    });
            });
    });

}

function getTesResultByID(expectedHTTPStatus, id, idTestDescriptor, Date, Result, rfid) {

    it("getting a TestResult by ID", function (done) {
        if (expectedHTTPStatus === 200) {
            let test = { id: id, rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result };
            agent.post("/api/skuitems/testResult")
                .send(test)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get("/api/skuitems/" + rfid + "/testResults/" + id).then(function (r2) {

                        r2.should.have.status(expectedHTTPStatus);
                        r2.body.id.should.equal(id);
                        r2.body.idTestDescriptor.should.equal(idTestDescriptor);
                        r2.body.Date.should.equal(Date);
                        r2.body.Result.should.equal(Result);
                        done();
                    });

                });

        }
        else if (expectedHTTPStatus === 404) {
            agent.get("/api/skuitems/" + rfid + "/testResults/" + id).then(function (r2) {
                r2.should.have.status(expectedHTTPStatus);
                done();
            });
        }

    });
}

function updateTestResult(expectedHTTPStatus, id, idTestDescriptor, Date, Result, rfid, newIdTestDescriptor, newDate, newResult) {


    it("Updating a TestResult", function (done) {
        if (expectedHTTPStatus === 200) {
            let test = { id: id, rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result };
            agent.post("/api/skuitems/testResult")
                .send(test)
                .then(function (res) {
                    res.should.have.status(201);
                    let newtest = { newIdTestDescriptor: newIdTestDescriptor, newDate: newDate, newResult: newResult };
                    agent.put("/api/skuitems/" + rfid + "/testResult/" + id)
                        .send(newtest)
                        .then(function (r) {
                            r.should.have.status(200);
                            done();

                        });
                });

        }
        else if (expectedHTTPStatus === 404) {
            let newtest = { newIdTestDescriptor: newIdTestDescriptor, newDate: newDate, newResult: newResult };
            agent.put("/api/skuitems/" + rfid + "/testResults/" + id)
                .send(newtest)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();

                });

        }
    });

}


function deleteTestResult(expectedHTTPStatus, id, idTestDescriptor, Date, Result, rfid) {
    it("deleting a TestResult", function (done) {

        if (id !== undefined) {
            let test = { id: id, rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result };
            agent.post("/api/skuitems/testResult")
                .send(test)
                .then(function (res) {

                    res.should.have.status(201);
                    agent.delete("/api/skuitems/" + rfid + "/testResult/" + id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })

                });
        }
        else {
            agent.delete("/api/skuitems/" + rfid + "/testResult/" + id)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })

        }

    });

}