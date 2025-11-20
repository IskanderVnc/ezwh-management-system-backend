'use strict';

const TestDescriptorService = require('../services/TestDescriptorService');
const testDescriptorDB = require('../database/TestDescriptorDB.js');
const testDescriptor_service = new TestDescriptorService(testDescriptorDB);
const Test_Descriptor = require('../models/Test_Descriptor.js');

describe('Test Descriptor Service - DB test', () => {

    beforeAll(async () => {
        await testDescriptor_service.deleteTestDescriptorData();
    });

    test('Checking if no test descriptors are present', async () => {

        var res = await testDescriptor_service.getTestDescriptorsList();
        expect(res.length).toStrictEqual(0);
    });

    // TEST : New TestDescriptor

    testNewTestDescriptor(new Test_Descriptor(1, "Test Descriptor 1", "Fake description of test", 1), 1) // ok
    testNewTestDescriptor(new Test_Descriptor(2, "Test Descriptor 2", "Fake description of test", 2), 2) // ok
    testNewTestDescriptor(new Test_Descriptor(3, "Test Descriptor 3", "Fake description of test", 2), 3) // ok
    testNewTestDescriptor(new Test_Descriptor(4, "Test Descriptor 3", "Fake description of test", undefined), 4)    // missing idSKU (NOT NULL CONSTRAINT FAILED)


    // TESTING GetTestDescriptor by ID

    testGetTestDescriptorByID(1, 1); // existing id => successfull test expected
    testGetTestDescriptorByID(2, 2); // existing id => successfull test expected
    testGetTestDescriptorByID(3, 3); // existing id => successfull test expected
    testGetTestDescriptorByID(4, 4); // non existing id => failed test expected

    // TESTING GetTestDescriptorList by SKUId

    testGetTestDescriptorListBySKUId(1, 1); // existing SKUId => succesfull test expected
    testGetTestDescriptorListBySKUId(2, 2); // existing SKUId => succesfull test expected
    testGetTestDescriptorListBySKUId(4, 0); // non existing SKUid => failed test expected

    // TESTING UpdateTestDescriptor by Id

    testUpdateTestDescriptor(new Test_Descriptor(1, "Modified Test Descriptor 1", "Fake description of test", 2), 1, 1) // existing id => successfull test expected
    testUpdateTestDescriptor(new Test_Descriptor(2, "Modified Test Descriptor 2", "Fake description of test", 1), 2, 2) // existing id => successfull test expected
    testUpdateTestDescriptor(new Test_Descriptor(3, "Modified Test Descriptor 3", "Fake description of test", 3), 4, 3) // non existing id => failed test expected
    testUpdateTestDescriptor(new Test_Descriptor(3, "Modified Test Descriptor 3", "Fake description of test", undefined), 4, 3) // missing idSKU (NOT NULL CONSTRAINT FAILED)

    // TESTING DeleteTestDescriptor by Id

    testDeleteTestDescriptor(1, 1); // existing id => successfull test expected
    testDeleteTestDescriptor(2, 2); // existing id => successfull test expected
    testDeleteTestDescriptor(3, 3); // existing id => successfull test expected
    testDeleteTestDescriptor(4, 4); // non existing id => failed test expected

    afterAll(async () => {
        await testDescriptor_service.deleteTestDescriptorData();
    });
});

function testNewTestDescriptor(testDescriptor, call) {
    test('Create new test descriptor', async () => {
        if (call <= 3) {
            let res = await testDescriptor_service.createTestDescriptor(testDescriptor);
            expect(res).toStrictEqual(true);
        } else {
            try {
                await testDescriptor_service.createTestDescriptor(testDescriptor);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}

function testGetTestDescriptorByID(id, call) {
    test('Get test descriptor by ID', async () => {
        let res;
        switch (call) {
            case 1:
                res = await testDescriptor_service.getTestDescriptorById(id);
                expect(res).toEqual({
                    id: 1,
                    name: "Test Descriptor 1",
                    procedureDescription: "Fake description of test",
                    idSKU: 1
                });
                break;
            case 2:
                res = await testDescriptor_service.getTestDescriptorById(id);
                expect(res).toEqual({
                    id: 2,
                    name: "Test Descriptor 2",
                    procedureDescription: "Fake description of test",
                    idSKU: 2
                });
                break;
            case 3:
                res = await testDescriptor_service.getTestDescriptorById(id);
                expect(res).toEqual({
                    id: 3,
                    name: "Test Descriptor 3",
                    procedureDescription: "Fake description of test",
                    idSKU: 2
                });
                break;
            case 4:
                res = await testDescriptor_service.getTestDescriptorById(id);
                expect(res).toStrictEqual(undefined);
                break;
        }

    });
}

function testGetTestDescriptorListBySKUId(idSKU, n) {

    test('Get test descriptor LIST  by ID - number of TestDescriptor found', async () => {
        if (n != 0) {
            let testDescriptorList = await testDescriptor_service.getTestDescriptorsListBySKUId(idSKU);
            expect(testDescriptorList.length).toStrictEqual(n);
        }
        else {
            let testDescriptorList = await testDescriptor_service.getTestDescriptorsListBySKUId(idSKU);
            expect(testDescriptorList.length).toStrictEqual(0);
        }
    });
}


function testUpdateTestDescriptor(testDescriptor, id, call) {

    test('Update Test Descriptor by Id', async () => {
        if (call <= 2) {
            let res = await testDescriptor_service.updateTestDescriptor(testDescriptor, id);
            expect(res).toStrictEqual(true);
        } else {
            let res = await testDescriptor_service.updateTestDescriptor(testDescriptor, id);
            expect(res).toStrictEqual(false);
        }
    });
}

function testDeleteTestDescriptor(id, call) {
    test('Delete test descriptor (by Id)', async () => {
        let res = await testDescriptor_service.deleteTestDescriptor(id);
        if (call <= 3) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}
