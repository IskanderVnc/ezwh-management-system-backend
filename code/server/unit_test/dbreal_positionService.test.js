'use strict';

const PositionService = require('../services/PositionService');
const PositionDB = require('../database/PositionDB.js');
const position_service = new PositionService(PositionDB);
const Position = require('../models/Position.js');





describe('Position Service - DB test', () => {

    beforeAll(async () => {
        await position_service.deletePositionData();
    });

    test('Checking if no test positions are present', async () => {

        var res = await position_service.getPositions();
        expect(res.length).toStrictEqual(0);
    });

    // TEST : New Position

    testNewPosition(new Position("800534543412", "8005", "3464", "3412", 1000, 1000, 120, 150)); // ok
    testNewPosition(new Position("800234543413", "8002", "3454", "3413", 1000, 1000, 300, 350)); // ok
    testNewPosition(new Position("801234543414", "8012", "3454", "3414", 1000, 1000, 360, 500)); // ok
    testNewPosition(new Position(undefined, "8012", "3454", "3416", 1000, 1000, 360, 500));    // missing PositionID (NOT NULL CONSTRAINT FAILED)

    // TESTING GetPositions
    testGetPositions()

    //// TESTING UpdatePosition by Id

    testUpdatePosition(new Position("800534643419", "8005", "3464", "3419", 1000, 1000, 120, 150), "800534543412", 1) // existing id => successfull test expected
    testUpdatePosition(new Position("800534643420", "8005", "3464", "3420", 1000, 1000, 120, 150), "800234543413", 2) // existing id => successfull test expected
    testUpdatePosition(new Position("800534643422", "8005", "3464", "3422", 1000, 1000, 120, 150), "801234543466", 3) // non existing id => failed test expected
    testUpdatePosition(new Position("800534643442", "8005", "3464", "3442", 1000, 1000, 120, undefined), "", 4)


    testUpdatePositionOccupiedValues(100, 100, "800534643419", 1);
    testUpdatePositionOccupiedValues(100, 100, "800534547777", 2);

    //// TESTING DeletePosition by Id

    testDeletePosition("800534643419", 1); // existing id => successfull test expected
    testDeletePosition("800534643420", 2); // existing id => successfull test expected
    testDeletePosition("801234543414", 3); // existing id => successfull test expected
    testDeletePosition("800534643442", 4); // non existing id => failed test expected

    afterAll(async () => {
        await position_service.deletePositionData();
    });

});

function testNewPosition(position, call) {
    test('Create new position', async () => {

        if (call <= 3) {
            // SUCCESSFULL CALLS
            let res = await position_service.createPosition(position);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await position_service.createPosition(position);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}


function testGetPositions() {

    test('Get position LIST ', async () => {
        let positions = await position_service.getPositions();
        expect(positions.length).toStrictEqual(3);
    });
}

function testUpdatePosition(position, positionIDTarget, call) {

    test('Update Position by PositionID', async () => {

        let newPosition = { positionID: position.positionID, aisleID: position.aisleID, row: position.row, col: position.col, maxWeight: position.maxWeight, maxVolume: position.maxVolume, occupiedWeight: 100, occupiedVolume: 200 };

        if (call <= 2) {
            let res = await position_service.updatePosition(newPosition, positionIDTarget);
            expect(res).toStrictEqual(true);
        } else {
            let res = await position_service.updatePosition(newPosition, positionIDTarget);
            expect(res).toStrictEqual(false);
        }
    });
}

function testDeletePosition(positionID, call) {
    test('Delete position (by PositionID)', async () => {
        let res = await position_service.deletePositionById(positionID);
        if (call <= 3) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}

function testUpdatePositionOccupiedValues(newOccupiedWeight, newOccupiedVolume, positionID, call) {

    test('Update position occupied values ', async () => {

        if (call === 1) {
            let res = await position_service.updatePositionOccupiedValues(positionID, newOccupiedWeight, newOccupiedVolume);
            expect(res).toStrictEqual(true);
        } else {
            let res = await position_service.updatePositionOccupiedValues(positionID, newOccupiedWeight, newOccupiedVolume);
            expect(res).toStrictEqual(false);
        }

    });
}