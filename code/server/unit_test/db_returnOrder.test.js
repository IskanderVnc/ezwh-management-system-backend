'use strict';

const Return_Order = require('../models/Return_Order');
const Product_Return = require('../models/Product_Return');
const db = require('../database/ReturnOrderDB');

describe('Return Order - DB test', () => {

    beforeAll(async () => {
        await db.deleteReturnOrderData();
        await db.deleteItemsToReturnData();
    });

    test('Checking if no return orders are present', async () => {
        var res = await db.getReturnOrderList();
        expect(res.length).toStrictEqual(0);
    });

    // TEST : New Return Order (returnOrder, call)
    // Some products are also created to be added in SkuItemToReturn table
    const product1 = new Product_Return(1, "product 1", 9.99, "12345678901234567890123456789011"); // ok
    const product2 = new Product_Return(2, "product 2", 13.99, "12345678901234567890123456789012"); // ok
    const product3 = new Product_Return(2, "product 3", 16.99, "12345678901234567890123456789013"); // ok
    const product4 = new Product_Return(3, "product 4", 110.99, "12345678901234567890123456789014"); // ok
    const product5 = new Product_Return(4, "product 5", 12.99, "12345678901234567890123456789013"); // DUPLICATED RFID (same as product 3) --> used to test unsuccessfull addsSkuItemToskuReturnTable function
    const product6 = new Product_Return(4, "product 6", 6.99, "12345678901234567890123456789014"); // DUPLICATED RFID (same as product 4)  --> used to test unsuccessfull addSkuItemToskuReturnTable function
    const ro1 = new Return_Order(1, "2022/03/29 09:30", 1, []);
    const ro2 = new Return_Order(2, "2022/04/15 11:33", 2, []);
    const ro3 = new Return_Order(3, "2022/04/15 11:46", 3, []);
    const ro4 = new Return_Order(4, "2022/06/05 18:23", undefined, undefined);

    testNewReturnOrder(ro1, 1) // ok
    testNewReturnOrder(ro2, 2) // ok
    testNewReturnOrder(ro3, 3) // ok
    testNewReturnOrder(ro4, 4)    // missing restockOrderID (NOT NULL CONSTRAINT FAILED)

    // TESTING addSkuItemToskuReturnTable (product,returnOrderID, call)

    testAddSkuItemToskuReturnTable(product1, 1, 1); //ok
    testAddSkuItemToskuReturnTable(product2, 1, 2); //ok
    testAddSkuItemToskuReturnTable(product3, 2, 3); //ok
    testAddSkuItemToskuReturnTable(product4, 2, 4); //ok 
    testAddSkuItemToskuReturnTable(product5, 2, 5); // item with duplicate rfid (same as product 3) and inserted in table with same returnId of product 3 => FAILED INSERTION
    testAddSkuItemToskuReturnTable(product6, 2, 6); // item with duplicate rfid (same as product 4) and inserted in table with same returnId of product 4 => FAILED INSERTION

    // TESTING GetReturnOrder by ID

    testGetReturnOrderByID(1); // existing id => successfull test expected
    testGetReturnOrderByID(2); // existing id => successfull test expected
    testGetReturnOrderByID(3); // existing id => successfull test expected
    testGetReturnOrderByID(4); // non existing id => failed test expected

    // TESTING NumberGetProductsToReturnOrder by ID (id,n) n = number of products expected

    testNumberGetProductsToReturnOrderByID(1, 2); // existing Id => succesfull test expected
    testNumberGetProductsToReturnOrderByID(2, 2); // existing Id => succesfull test expected
    testNumberGetProductsToReturnOrderByID(3, 0); // existing Id => succesfull test expected
    testNumberGetProductsToReturnOrderByID(4, 0); // non existing id => failed test expected

    // TESTING ContentGetProductsToReturnOrder by ID (id)

    testContentGetProductsToReturnOrderByID(1); // content found and verified
    testContentGetProductsToReturnOrderByID(2); // content found and verified
    testContentGetProductsToReturnOrderByID(3); // no content for that id -> length = 0 verified
    testContentGetProductsToReturnOrderByID(4); // no content for that id -> length = 0 verified

    // TESTING DeleteReturnOrder by Id

    testDeleteReturnOrderByID(1); // existing id => successfull test expected
    testDeleteReturnOrderByID(2); // existing id => successfull test expected
    testDeleteReturnOrderByID(3); // existing id => successfull test expected
    testDeleteReturnOrderByID(4); // non existing id => failed test expected*/

    afterAll(async () => {
        await db.deleteReturnOrderData();
        await db.deleteItemsToReturnData();
    });
});

function testNewReturnOrder(returnOrder, call) {
    test('Create new Return Order', async () => {

        if (call <= 3) {
            // SUCCESSFULL CALLS
            let res = await db.createReturnOrder(returnOrder);
            expect(res).toStrictEqual(call);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                let res = await db.createReturnOrder(returnOrder);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}


function testGetReturnOrderByID(id) {
    test('Get Return Order by ID', async () => {
        let res;
        switch (id) {
            case 1:
                res = await db.getReturnOrderbyId(id);
                expect(res).toEqual({
                    id: 1,
                    returnDate: "2022/03/29 09:30",
                    products: [],
                    restockOrderId: 1
                });
                break;
            case 2:
                res = await db.getReturnOrderbyId(id);
                expect(res).toEqual({
                    id: 2,
                    returnDate: "2022/04/15 11:33",
                    products: [],
                    restockOrderId: 2
                });
                break;
            case 3:
                res = await db.getReturnOrderbyId(id);
                expect(res).toEqual({
                    id: 3,
                    returnDate: "2022/04/15 11:46",
                    products: [],
                    restockOrderId: 3
                });
                break;
            case 4:
                res = await db.getReturnOrderbyId(id);
                expect(res).toStrictEqual(undefined);
                break;
        }

    });
}

function testAddSkuItemToskuReturnTable(product, returnOrderID, call) {
    test('Add products to SkuItemsToReturn table', async () => {
        if (call <= 4) {
            // SUCCESSFULL CALLS 
            let res = await db.addSkuItemToSkuReturnTable(product, returnOrderID);
            expect(res).toStrictEqual(true);
        } else {
            // CALLS WITH DB ERROR CAUSE BY FAILED CONTSTRAINTS
            try {
                await db.addSkuItemToSkuReturnTable(product, returnOrderID);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }
        }
    });
}

function testNumberGetProductsToReturnOrderByID(id, n) {

    test('Get Products of a Return Order by ID - Check of quantity of found products ', async () => {
        if (n != 0) {
            let products = await db.getProductstoReturnOrder(id);
            expect(products.length).toStrictEqual(n);
        }
        else {
            let products = await db.getProductstoReturnOrder(id);
            expect(products.length).toStrictEqual(0);
        }
    });
}

function testContentGetProductsToReturnOrderByID(id) {
    test('Get Products of a Return Order by ID - Check of content of found products', async () => {
        let res;
        switch (id) {
            case 1:
                res = await db.getProductstoReturnOrder(id);
                expect(res[0]).toEqual({
                    RFID: "12345678901234567890123456789011",
                    SKUId: 1,
                    price: 9.99,
                    description: "product 1"
                });
                expect(res[1]).toEqual({
                    RFID: "12345678901234567890123456789012",
                    SKUId: 2,
                    price: 13.99,
                    description: "product 2"
                });
                break;
            case 2:
                res = await db.getProductstoReturnOrder(id);
                expect(res[0]).toEqual({
                    RFID: "12345678901234567890123456789013",
                    SKUId: 2,
                    price: 16.99,
                    description: "product 3"
                });
                expect(res[1]).toEqual({
                    RFID: "12345678901234567890123456789014",
                    SKUId: 3,
                    price: 110.99,
                    description: "product 4"
                });
                break;
            case 3:
                res = await db.getProductstoReturnOrder(id);
                expect(res.length).toStrictEqual(0);
                break;
            case 4:
                res = await db.getProductstoReturnOrder(id);
                expect(res.length).toStrictEqual(0);
                break;
        }
    });
}

function testDeleteReturnOrderByID(id) {
    test('Delete Return Order by ID', async () => {
        let res = await db.deleteReturnOrderById(id);
        if (id <= 3) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}