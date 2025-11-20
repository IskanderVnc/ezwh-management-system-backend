'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const skuDB = require('../database/SkuDB');
const testDescriptorDB = require('../database/TestDescriptorDB');



const app = require('../server');
const Sku = require('../models/Sku');
var agent = chai.request.agent(app);


describe("Test TestDescriptor Api", () => {


    beforeEach(async () => {
        await skuDB.deleteSKUData();
        await testDescriptorDB.deleteTestDescriptorData();
        await skuDB.createSku(new Sku(1, "a new sku", 100, 50, "a sku", 50, 9.99));
    });

    //HAPPY
    newTestDescriptor(201, 1, "test descriptor 1", "This test is described by...", 1);
    getTestDescriptorList(200, 1, "test descriptor 1", "This test is described by...", 1, 2, "test descriptor 2", "This test is described by 2...", 1);
    getTestDescriptorByID(200, 1, "test descriptor 1", "This test is described by...", 1);
    updateTestDescriptor(200, 1, "test descriptor 1", "This test is described by...", 1, "newname test descriptor1", "new procedure by..", 1);
    deleteTestDescriptor(204, 1, "test descriptor 1", "This test is described by...", 1);

    //WRONG
    newTestDescriptor(422, undefined, "test descriptor 1", "This test is described by...", 1);
    newTestDescriptor(422, 1, undefined, "This test is described by...", 1);
    newTestDescriptor(422, 1, "test descriptor 1", undefined, 1);
    newTestDescriptor(422, 1, "test descriptor 1", "This test is described by...", undefined);
    getTestDescriptorByID(404, 12, "test descriptor 1", "This test is described by...", 1);
    updateTestDescriptor(404, 1, "test descriptor 1", "This test is described by...", 5, "newname test descriptor1", "new procedure by..", 1); //wrong skuId
    updateTestDescriptor(404, 12, "test descriptor 1", "This test is described by...", 1, "newname test descriptor1", "new procedure by..", 1);//wrong testId
    deleteTestDescriptor(422, undefined, "test descriptor 1", "This test is described by...", 1);


    afterEach(async () => {

        await skuDB.deleteSKUData();
        await testDescriptorDB.deleteTestDescriptorData();
    })

});


function newTestDescriptor(expectedHTTPStatus, id, name, procedureDescription, idSKU) {


    it('adding a new TestDescriptor ', function (done) {


        if (id !== undefined && name !== undefined && procedureDescription !== undefined && idSKU !== undefined) {
            let test = { id: id, name: name, procedureDescription: procedureDescription, idSKU: idSKU };
            agent.post("/api/testDescriptor")
                .send(test)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else {
            agent.post("/api/testDescriptor").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}

function getTestDescriptorList(expectedHTTPStatus, id, name, procedureDescription, idSKU, id2, name2, procedureDescription2, idSKU2) {

    it("getting a TestDescriptor List", function (done) {

        let test = { id: id, name: name, procedureDescription: procedureDescription, idSKU: idSKU };
        agent.post("/api/testDescriptor")
            .send(test)
            .then(function (res) {
                res.should.have.status(201);
                let test2 = { id: id2, name: name2, procedureDescription: procedureDescription2, idSKU: idSKU2 };
                agent.post("/api/testDescriptor")
                    .send(test2)
                    .then(function (r) {

                        r.should.have.status(201);

                        agent.get("/api/testDescriptors").then(function (ret) {


                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].id.should.equal(id);
                            ret.body[1].id.should.equal(id2);
                            ret.body[0].name.should.equal(name);
                            ret.body[1].name.should.equal(name2);
                            ret.body[0].procedureDescription.should.equal(procedureDescription);
                            ret.body[1].procedureDescription.should.equal(procedureDescription2);
                            ret.body[0].idSKU.should.equal(idSKU);
                            ret.body[1].idSKU.should.equal(idSKU2);
                            done();
                        });
                    });
            });
    });

}

function getTestDescriptorByID(expectedHTTPStatus, id, name, procedureDescription, idSKU) {

    it("getting a TestDescriptor by ID", function (done) {
        if (expectedHTTPStatus === 200) {
            let test = { id: id, name: name, procedureDescription: procedureDescription, idSKU: idSKU };
            agent.post("/api/testDescriptor")
                .send(test)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get("/api/testDescriptors/" + id).then(function (r2) {

                        r2.should.have.status(expectedHTTPStatus);
                        r2.body.id.should.equal(id);
                        r2.body.name.should.equal(name);
                        r2.body.procedureDescription.should.equal(procedureDescription);
                        done();
                    });

                });

        }
        else if (expectedHTTPStatus === 404) {
            agent.get("/api/testDescriptors/" + id).then(function (r2) {
                r2.should.have.status(expectedHTTPStatus);
                done();
            });
        }

    });
}

function updateTestDescriptor(expectedHTTPStatus, id, name, procedureDescription, idSKU, newName, newProcedureDescription, newIdSKU) {


    it("Updating a TestDescriptor", function (done) {
        if (expectedHTTPStatus === 200) {
            let test = { id: id, name: name, procedureDescription: procedureDescription, idSKU: idSKU };
            agent.post("/api/testDescriptor")
                .send(test)
                .then(function (res) {
                    res.should.have.status(201);
                    let newtest = { newName: newName, newProcedureDescription: newProcedureDescription, newIdSKU: newIdSKU };
                    agent.put("/api/testDescriptor/" + id)
                        .send(newtest)
                        .then(function (r) {
                            r.should.have.status(200);
                            done();

                        });
                });

        }
        else if (expectedHTTPStatus === 404) {
            let newtest = { newName: newName, newProcedureDescription: newProcedureDescription, newIdSKU: newIdSKU };
            agent.get("/api/testDescriptor/" + id)
                .send(newtest)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();

                });

        }
    });

}

function deleteTestDescriptor(expectedHTTPStatus, id, name, procedureDescription, idSKU) {
    it("deleting a TestDescriptor", function (done) {

        if (id !== undefined) {
            let test = { id: id, name: name, procedureDescription: procedureDescription, idSKU: idSKU };
            agent.post("/api/testDescriptor")
                .send(test)
                .then(function (res) {

                    res.should.have.status(201);
                    agent.delete("/api/testDescriptor/" + id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })

                });
        }
        else {
            agent.delete("/api/testDescriptor/" + id)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })

        }

    });

}
