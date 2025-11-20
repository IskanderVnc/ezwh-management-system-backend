'use strict';

const TestResultService = require('../services/TestResultService');
const testResultDB = require('../database/TestResultDB.js');
const testResult_service = new TestResultService(testResultDB);
const Test_Result = require('../models/Test_Result.js');


describe('Test Result Service - DB test', () => {

    beforeAll(async () => {
        await testResult_service.deleteTestResultData();
    });

    // TEST : New TestResult

    testNewTestResult(new Test_Result(1, 1, "2022/08/15", true), "12345678901234567890123456789016", 1) // ok
    testNewTestResult(new Test_Result(2, 2, "2022/10/16", true), "12345678901234567890123456789016", 2) // ok
    testNewTestResult(new Test_Result(3, 2, "2022/09/17", false), "12345678901234567890123456789022", 3) // ok
    testNewTestResult(new Test_Result(4, 3, "2022/12/18", false), undefined, 4)    // missing RFID (NOT NULL CONSTRAINT FAILED)


    // TESTING GetTestResult by ID and RFID

    testGetTestResultByIDandRFID(1, "12345678901234567890123456789016", 1); // existing ID and RFID => successfull test expected
    testGetTestResultByIDandRFID(2, "12345678901234567890123456789016", 2); // existing ID and RFID => successfull test expected
    testGetTestResultByIDandRFID(3, "12345678901234567890123456789022", 3); // existing ID and RFID => successfull test expected
    testGetTestResultByIDandRFID(4, "12345678901234567890123456789022", 4); // non existing ID - existing RFID => failed test expected
    testGetTestResultByIDandRFID(2, "12345678901234567890123456789444", 4); // existing ID - non existing RFID => failed test expected
    testGetTestResultByIDandRFID(4, "12345678901234567890123456789555", 4); // non existing ID - non existing RFID => failed test expected


    // TESTING GetTestResultList by RFID

    testGetTestResultListByRFID("12345678901234567890123456789016", 2); // existing RFID => succesfull test expected
    testGetTestResultListByRFID("12345678901234567890123456789022", 1); // existing RFID => succesfull test expected
    testGetTestResultListByRFID("12345678901234567890123456789444", 0); // non existing RFID => failed test expected

    // TESTING UpdateTestResult by Id

    testUpdateTestResult(new Test_Result(1, 2, "2022/08/15", false), 1, 1) // existing id => successfull test expected
    testUpdateTestResult(new Test_Result(2, 1, "2022/10/16", true), 2, 2) // existing id => successfull test expected
    testUpdateTestResult(new Test_Result(3, 1, "2022/09/17", false), 4, 3) // non existing id => failed test expected
    testUpdateTestResult(new Test_Result(3, 1, "2022/09/17", undefined), 4, 3) // UDEFINED value => NOT NULL CONSTRAINT FAILED

    // TESTING DeleteTestResult by Id

    testDeleteTestResult(1, 1); // existing id => successfull test expected
    testDeleteTestResult(2, 2); // existing id => successfull test expected
    testDeleteTestResult(3, 3); // existing id => successfull test expected
    testDeleteTestResult(4, 4); // non existing id => failed test expected*/

    afterAll(async () => {
        await testResult_service.deleteTestResultData();
    });
});

function testNewTestResult(testResult, rfid, call) {
    test('Create new test Result', async () => {
        if (call <= 3) {
            let res = await testResult_service.createTestResult(testResult, rfid);
            expect(res).toStrictEqual(true);
        } else {
            try {
                await testResult_service.createTestResult(testResult, rfid);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}

function testGetTestResultByIDandRFID(id, rfid, call) {
    test('Get test Result by ID and RFID', async () => {
        let res;
        switch (call) {
            case 1:
                res = await testResult_service.getTestResultByIdAndRFID(id, rfid);
                expect(res).toEqual({
                    id: 1,
                    idTestDescriptor: 1,
                    Date: "2022/08/15",
                    Result: true
                });
                break;
            case 2:
                res = await testResult_service.getTestResultByIdAndRFID(id, rfid);
                expect(res).toEqual({
                    id: 2,
                    idTestDescriptor: 2,
                    Date: "2022/10/16",
                    Result: true
                });
                break;
            case 3:
                res = await testResult_service.getTestResultByIdAndRFID(id, rfid);
                expect(res).toEqual({
                    id: 3,
                    idTestDescriptor: 2,
                    Date: "2022/09/17",
                    Result: false
                });
                break;
            case 4:
                res = await testResult_service.getTestResultByIdAndRFID(id, rfid);
                expect(res).toStrictEqual(undefined);
                break;
            case 5:
                res = await testResult_service.getTestResultByIdAndRFID(id, rfid);
                expect(res).toStrictEqual(undefined);
                break;
            case 6:
                res = await testResult_service.getTestResultByIdAndRFID(id, rfid);
                expect(res).toStrictEqual(undefined);
                break;
        }

    });
}

function testGetTestResultListByRFID(rfid, n) {
    test('Get test Result LIST by RFID - number of TestResult found', async () => {
        if (n != 0) {
            let testResultList = await testResult_service.getTestResultListByRFID(rfid);
            expect(testResultList.length).toStrictEqual(n);
        }
        else {
            let testResultList = await testResult_service.getTestResultListByRFID(rfid);
            expect(testResultList.length).toStrictEqual(0);
        }
    });
}

function testUpdateTestResult(testResult, id, call) {
    test('Update Test Result by Id', async () => {
        if (call <= 2) {
            let res = await testResult_service.updateTestResult(testResult, id);
            expect(res).toStrictEqual(true);
        } else {
            let res = await testResult_service.updateTestResult(testResult, id);
            expect(res).toStrictEqual(false);
        }
    });
}

function testDeleteTestResult(id, call) {
    test('Delete test Result (by Id)', async () => {
        let res = await testResult_service.deleteTestResult(id);
        if (call <= 3) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}