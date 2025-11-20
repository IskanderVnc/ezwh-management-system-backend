'use strict';

const InternalOrder = require('../models/Internal_Order');
const Product_Return = require('../models/Product_Return');
const Product = require('../models/Product');
const db = require('../database/InternalOrderDB.js');

describe('Internal Order  - DB test', () => {

    beforeAll(async () => {
        await db.deleteInternalOrderData();
        await db.deleteSkuToInternalData();
        await db.deleteSkuItemToInternalData();
    });


    testCreateInternalOrder(new InternalOrder(undefined, '2021/11/29 09:33', 1), 1);
    testCreateInternalOrder(new InternalOrder(undefined, '2021/11/29 09:43', 2), 2);
    testCreateInternalOrder(new InternalOrder(undefined, '2021/11/29 09:23', 2), 3);
    testCreateInternalOrder(new InternalOrder(undefined, '2021/11/29 09:23', undefined), 4);

    testCreateSkuItemToInternal(new Product_Return('12', "a product1", 11.99, '12345678901234567890123456789016'), 1, 1);
    testCreateSkuItemToInternal(new Product_Return('13', "a product2", 4.99, '12345678901234567890123456789017'), 2, 2);
    testCreateSkuItemToInternal(new Product_Return('14', "a product3", 5.99, '12345678901234567890123456789018'), 3, 3);
    testCreateSkuItemToInternal(new Product_Return('2', "a product4", undefined, '12345678901234567890123456789019'), 4, 4);

    testAddSkuItemToSkuInternalTable(new Product("12", "a product1", 11.99, 2), 1, 1);
    testAddSkuItemToSkuInternalTable(new Product("13", "a product2", 4.99, 5), 2, 2);
    testAddSkuItemToSkuInternalTable(new Product("14", "a product3", 5.99, 7), 3, 3);
    testAddSkuItemToSkuInternalTable(new Product(undefined, "a product4", 10.45, 6), 4, 4);

    testGetInternalOrderList();

    testGetInternalOrderbyID(1, 1);
    testGetInternalOrderbyID(4, 2);

    //testGetsingleProductsCompletedtoInternalOrder('12', '12345678901234567890123456789016', 1);
    testGetsingleProductsCompletedtoInternalOrder('34', '12345678901234567890123456789017', 2);

    testGetProductsIssuedtoInternalOrder(1, 1);
    testGetProductsIssuedtoInternalOrder(4, 2);

    testGetProductsCompletedtoInternalOrder(1, 1);
    testGetProductsCompletedtoInternalOrder(4, 2);

    testUpdateInternalOrderState("COMPLETED", 1, 1);
    testUpdateInternalOrderState("COMPLETED", 4, 2);
    testUpdateInternalOrderState(undefined, 1, 2);

    testDeleteInternalOrderByID(2, 1);
    testDeleteInternalOrderByID(4, 2);

    testDeleteSkuToInternalItem(12, 1, 1);
    testDeleteSkuToInternalItem(13, 2, 2);
    testDeleteSkuToInternalItem(undefined, 2, 1);

    afterAll(async () => {
        await db.deleteInternalOrderData();
        await db.deleteSkuToInternalData();
        await db.deleteSkuItemToInternalData();
    });

});

function testCreateInternalOrder(internalorder, call) {
    test('Create new internal Order', async () => {

        if (call <= 3) {
            // SUCCESSFULL CALLS
            let res = await db.createInternalOrder(internalorder);
            expect(res).toStrictEqual(call);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await db.createInternalOrder(internalorder);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}

function testCreateSkuItemToInternal(item, id, call) {
    test('Create new prod return for internal Order', async () => {

        if (call <= 3) {
            // SUCCESSFULL CALLS
            let res = await db.createSkuItemToInternal(item, id);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await db.createSkuItemToInternal(item, id);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}


function testAddSkuItemToSkuInternalTable(prod, id, call) {
    test('Create new prod for internal Order', async () => {

        if (call <= 3) {
            // SUCCESSFULL CALLS
            let res = await db.addSkuItemToSkuInternalTable(prod, id);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await db.addSkuItemToSkuInternalTable(prod, id);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}



function testUpdateInternalOrderState(state, id, call) {
    test('update internal order state', async () => {
        if (call === 1) {
            // SUCCESSFULL CALLS
            let res = await db.updateInternalOrderState(state, id);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await db.updateInternalOrderState(state, id);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }
        }
    });
};


function testDeleteInternalOrderByID(id, call) {
    test('Delete Internal Order by ID', async () => {
        let res = await db.deleteInternalOrderById(id);
        if (call === 1) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}

function testDeleteSkuToInternalItem(skuid, id, call) {
    test('Delete Internal Order item by ID', async () => {
        if (call === 1) {
            try {
                let res = await db.deleteSkuToInternalItem(skuid, id);
                expect(res).toStrictEqual(true);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }
        }
        else {
            let res = await db.deleteSkuToInternalItem(skuid, id);
            expect(res).toStrictEqual(false);
        }
    });
}


function testGetInternalOrderList() {
    test('Get internal order list', async () => {
        let res = await db.getInternalOrderList();
        expect(res).toEqual([{
            id: 1,
            issueDate: '2021/11/29 09:33',
            state: 'ISSUED',
            customerId: 1,
            products: []
        }, {
            id: 2,
            issueDate: '2021/11/29 09:43',
            state: 'ISSUED',
            customerId: 2,
            products: []
        }, {
            id: 3,
            issueDate: '2021/11/29 09:23',
            state: 'ISSUED',
            customerId: 2,
            products: []
        }]);
    });
};

function testGetInternalOrderbyID(id, call) {
    test('Get internal order by id', async () => {
        let res;
        switch (call) {
            case 1:
                res = await db.getInternalOrderbyID(id);
                expect(res).toEqual({
                    id: 1,
                    issueDate: '2021/11/29 09:33',
                    state: 'ISSUED',
                    customerId: 1,
                    products: []
                });
                break;
            case 2:
                res = await db.getInternalOrderbyID(id);
                expect(res).toEqual(undefined);
                break;
        }
    });
};


// product(values)

function testGetsingleProductsCompletedtoInternalOrder(id, rfid, call) {
    test('Get products completed to internal order by id', async () => {
        let res;
        switch (call) {
            case 1:
                res = await db.getsingleProductsCompletedtoInternalOrder(id, rfid);
                expect(res).toEqual({
                    SKUId: 12,
                    description: 'a product1',
                    price: 11.99,
                    RFID: '12345678901234567890123456789016'
                });
                break;
            case 2:
                res = await db.getsingleProductsCompletedtoInternalOrder(id, rfid);
                expect(res).toEqual(undefined);
                break;
        }
    });
};



function testGetProductsIssuedtoInternalOrder(id, call) {
    test('Get product issued to internal order by id', async () => {
        let res;
        switch (call) {
            case 1:
                res = await db.getProductsIssuedtoInternalOrder(id);
                expect(res).toEqual([{
                    price: 11.99,
                    SKUId: 12,
                    qty: 2,
                    description: 'a product1',
                }]);
                break;
            case 2:
                res = await db.getProductsIssuedtoInternalOrder(id);
                expect(res).toEqual([]);
                break;
        }
    });
};

function testGetProductsCompletedtoInternalOrder(id, call) {
    test('Get products completed to internal order by id', async () => {
        let res;
        switch (call) {
            case 1:
                res = await db.getProductsCompletedtoInternalOrder(id);
                expect(res).toEqual([{
                    SKUId: 12,
                    description: 'a product1',
                    price: 11.99,
                    RFID: '12345678901234567890123456789016',
                }]);
                break;
            case 2:
                res = await db.getProductsCompletedtoInternalOrder(id);
                expect(res).toEqual([]);
                break;
        }
    });
};
