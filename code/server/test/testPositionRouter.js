'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const positionDB = require("../database/PositionDB");


const app = require('../server');
var agent = chai.request.agent(app);

describe("Test Position Api", () => {


    beforeEach(async () => {
        await positionDB.deletePositionData();
    });

    //HAPPY
    newPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
    getPositionList(200, "800234543412", "8002", "3454", "3412", 1000, 1000, "800234543413", "8002", "3454", "3413", 2000, 2000);
    updatePosition(200, "800234543412", "800234543412", "8002", "3454", "3412", 1000, 1000, "8002", "3454", "3413", 2000, 2000, 1000, 1000);
    updatePositionID(200, "800234543412", "899999999999", "800234543412", "8002", "3454", "3413", 2000, 2000);
    deletePosition(204, "800234543412", "800234543412", "8002", "3454", "3413", 2000, 2000);

    //WRONG
    newPosition(422, "800234543413", undefined, "3454", "3413", 1000, 1000);
    newPosition(422, "800234543414", "8002", undefined, "3414", 2000, 2000);
    newPosition(422, "800234543415", "8002", "3454", "3415", 1000, undefined);
    updatePosition(404, "800444444444", "800234543412", "8002", "3454", "3412", 1000, 1000, "8002", "3454", "3413", 2000, 2000, 1000, 1000);
    updatePositionID(404, "899999999999", "899999999998");
    deletePosition(422, undefined, "800234543412", "8002", "3454", "3413", 2000, 2000);

    afterEach(async () => {
        await positionDB.deletePositionData();

    })

});



function newPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('adding a new Position ', function (done) {
        if (positionID !== undefined && aisleID !== undefined && row !== undefined && col !== undefined && maxWeight !== undefined && maxVolume !== undefined) {
            let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume };
            agent.post("/api/position")
                .send(position)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else {
            agent.post("/api/position").then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}

function getPositionList(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume, positionID2, aisleID2, row2, col2, maxWeight2, maxVolume2) {

    it("getting a position List", function (done) {

        let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume };
        agent.post("/api/position")
            .send(position)
            .then(function (res) {
                res.should.have.status(201);
                let position2 = { positionID: positionID2, aisleID: aisleID2, row: row2, col: col2, maxWeight: maxWeight2, maxVolume: maxVolume2 };
                agent.post("/api/position")
                    .send(position2)
                    .then(function (r) {
                        r.should.have.status(201);
                        agent.get("/api/positions").then(function (ret) {
                            ret.should.have.status(expectedHTTPStatus);
                            ret.body[0].positionID.should.equal(positionID);
                            ret.body[1].positionID.should.equal(positionID2);
                            ret.body[0].aisleID.should.equal(aisleID);
                            ret.body[1].aisleID.should.equal(aisleID2);
                            ret.body[0].row.should.equal(row);
                            ret.body[1].row.should.equal(row2);
                            ret.body[0].col.should.equal(col);
                            ret.body[1].col.should.equal(col2);
                            ret.body[0].maxWeight.should.equal(maxWeight);
                            ret.body[1].maxWeight.should.equal(maxWeight2);
                            ret.body[0].maxVolume.should.equal(maxVolume);
                            ret.body[1].maxVolume.should.equal(maxVolume2);
                            done();
                        });
                    });
            });
    });

}

function updatePosition(expectedHTTPStatus, positionIDTarget, positionID, aisleID, row, col, maxWeight, maxVolume, aisleID2, row2, col2, maxWeight2, maxVolume2, newOccupiedWeight, newOccupiedVolume) {

    it("Updating a position", function (done) {
        if (expectedHTTPStatus === 200) {
            let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume };
            agent.post("/api/position")
                .send(position)
                .then(function (res) {
                    res.should.have.status(201);
                    let newPosition = { newAisleID: aisleID2, newRow: row2, newCol: col2, newMaxWeight: maxWeight2, newMaxVolume: maxVolume2, newOccupiedWeight: newOccupiedWeight, newOccupiedVolume: newOccupiedVolume };
                    agent.put("/api/position/" + parseInt(positionIDTarget))
                        .send(newPosition)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });

        }
        else if (expectedHTTPStatus === 404) {
            let newPosition = { newAisleID: aisleID2, newRow: row2, newCol: col2, newMaxWeight: maxWeight2, newMaxVolume: maxVolume2, newOccupiedWeight: newOccupiedWeight, newOccupiedVolume: newOccupiedVolume };
            agent.put("/api/position/" + parseInt(positionIDTarget))
                .send(newPosition)
                .then(function (r2) {
                    r2.should.have.status(expectedHTTPStatus);
                    done();
                });

        }
    });

}

function updatePositionID(expectedHTTPStatus, positionIDTarget, newPositionID, positionID, aisleID, row, col, maxWeight, maxVolume) {

    it("Updating a position ID of an existing position", function (done) {
        if (expectedHTTPStatus === 200) {
            let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume };
            agent.post("/api/position")
                .send(position)
                .then(function (res) {
                    res.should.have.status(201);
                    let newPositionIDToPass = { newPositionID: newPositionID };
                    agent.put("/api/position/" + positionIDTarget + "/changeID")
                        .send(newPositionIDToPass)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });

        }
        else if (expectedHTTPStatus === 404) {
            let newPositionIDToPass = { newPositionID: newPositionID };
            agent.put("/api/position/" + positionIDTarget + "/changeID")
                .send(newPositionIDToPass)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });

}

function deletePosition(expectedHTTPStatus, positionIDTarget, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it("deleting a Position", function (done) {
        if (positionIDTarget !== undefined) {
            let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume };
            agent.post("/api/position")
                .send(position)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete("/api/position/" + positionIDTarget)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });

        }
        else {
            agent.delete("/api/position/" + positionIDTarget)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                });

        }
    });
}