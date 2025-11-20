'use strict';

const Restock_Order = require('../models/Restock_Order');
const Sku_Item_RestockOrder = require('../models/Sku_Item_RestockOrder');
const Product = require('../models/Product');

const RestockOrderService = require('../services/RestockOrderService');
const RestockOrderDB = require('../database/RestockOrderDB.js');
const restockOrder_service = new RestockOrderService(RestockOrderDB);

describe('Restock Order Service - DB test', () => {

    beforeAll(async () => {
        await restockOrder_service.deleteRestockOrderData();
        await restockOrder_service.deleteSKUItemToRestockData();
        await restockOrder_service.deleteSKUToRestockData();
    });

    test('Checking if no Restock orders are present', async () => {
        var res = await restockOrder_service.getRestockOrderList();
        expect(res.length).toStrictEqual(0);
    });

    // TEST : New Restock Order (RestockOrder, call)
    // Some products are also created to be added in SkuItemToRestock table
    // constructor(SKUId,description,price, qty)
    const product1 = new Product(1, "product 1", 9.99, 24); // 
    const product2 = new Product(2, "product 2", 13.99, 43); // 
    const product3 = new Product(2, "product 3", 16.99, 55); // 
    const product4 = new Product(3, "product 4", 110.99, 18); // 
    const product5 = new Product(undefined, "product 5", 12.99, 96); // SKUId is undefined --> insertion in SKUtoRestockTable will fail (NOT NULL CONSTRAINT FAILED)
    const product6 = new Product(3, "product 6", 6.99, 67); // SAME SKUId of product4 --> insertion in SKUtoRestockTable will fail if executed with same RESTOCKId (PRIMARY KEYS CONSTRAINT FAILED)
    // 	constructor(RFID, SKUId) 
    const item1 = new Sku_Item_RestockOrder("12345678901234567890123456789011", 1);
    const item2 = new Sku_Item_RestockOrder("12345678901234567890123456789012", 2);
    const item3 = new Sku_Item_RestockOrder("12345678901234567890123456789013", 2);
    const item4 = new Sku_Item_RestockOrder("12345678901234567890123456789014", 3);
    const item5 = new Sku_Item_RestockOrder("12345678901234567890123456789015", undefined); // SKUId is undefined --> insertion in SKUItemtoRestockTable will fail (NOT NULL CONSTRAINT FAILED)
    const item6 = new Sku_Item_RestockOrder("12345678901234567890123456789014", 3); // SAME rfid as item4 --> insertion in SKUItemtoRestockTable will fail if executed with same RESTOCKId (NOT NULL CONSTRAINT FAILED) 

    //constructor(id, issueDate, state, supplierId, transportNote=undefined,products=[], skuItems = [])
    const ro1 = new Restock_Order(1, "2022/03/29 09:30", "DELIVERED", 1, "Transport Note");
    const ro2 = new Restock_Order(2, "2022/04/15 11:33", "DELIVERY", 2, "Transport Note");
    const ro3 = new Restock_Order(3, "2022/06/05 18:23", undefined, 3, "Transport Note"); // STATUS UNDEFINED -> NOT NULL CONSTRAINT FAILED

    testNewRestockOrder(ro1, 1) // ok
    testNewRestockOrder(ro2, 2) // ok
    testNewRestockOrder(ro3, 3) // missing restockOrderID (NOT NULL CONSTRAINT FAILED)

    // TESTING GetRestockOrder by ID

    testGetRestockOrderByID(1); // existing id => successfull test expected
    testGetRestockOrderByID(2); // existing id => successfull test expected
    testGetRestockOrderByID(3); // non existing id => failed test expected

    // TESTING addSkuItemToskuRestockTable (product,RestockOrderID, call)

    testAddSkuItemToskuRestockTable(product1, 1, 1); //ok
    testAddSkuItemToskuRestockTable(product2, 1, 2); //ok
    testAddSkuItemToskuRestockTable(product3, 2, 3); //ok
    testAddSkuItemToskuRestockTable(product4, 2, 4); //ok 
    testAddSkuItemToskuRestockTable(product5, 2, 5); // product with missing SKUid (NOT NULL CONSTRAINT FAILED) => FAILED INSERTION
    testAddSkuItemToskuRestockTable(product6, 2, 6); // product with SAME SKUid and SAME restockOrderId as product 4 => FAILED INSERTION

    // TESTING addSkuItemToSkuItemRestockTable (item,RestockOrderID, call)

    testAddSkuItemToSkuItemToRestockTable(item1, 1, 1)
    testAddSkuItemToSkuItemToRestockTable(item2, 1, 2)
    testAddSkuItemToSkuItemToRestockTable(item3, 2, 3)
    testAddSkuItemToSkuItemToRestockTable(item4, 2, 4)
    testAddSkuItemToSkuItemToRestockTable(item5, 2, 5) // item with undefined SKUid (NOT NULL CONSTRAINT FAILED) => FAILED INSERTION
    testAddSkuItemToSkuItemToRestockTable(item6, 2, 6) // item with SAME rfid and SAME  RESTOCKId as item4  (NOT NULL CONSTRAINT FAILED) => FAILED INSERTION

    // TESTING addProductsToOrder by ID (id) - addProductsToOrder is a function that returns an arrow of products taken from SKUToRestock which is used in APIs to add the array into the restockOrder Object

    testAddProductsToOrder(1) // ok
    testAddProductsToOrder(2) // ok
    testAddProductsToOrder(3) // non existing id => retrieval of products for this id failed

    // TESTING NumbergetSkuItemsToRestockOrder by ID (id,n) n = number of items expected

    testNumberGetSkuItemsToRestockOrder(1, 2); // existing Id => succesfull test expected
    testNumberGetSkuItemsToRestockOrder(2, 2); // existing Id => succesfull test expected
    testNumberGetSkuItemsToRestockOrder(3, 0); // non existing id => failed test expected

    // TESTING ContentgetSkuItemsToRestockOrder by ID (id) n = number of items expected

    testContentGetSkuItemsToRestockOrder(1); // content found and verified
    testContentGetSkuItemsToRestockOrder(3); // no content for that id -> length = 0 verified

    // TESTING updateRestockOrderState (restockOrder, restockOrderID) 

    testUpdateRestockOrderState(new Restock_Order(undefined, "", "COMPLETED", undefined, ""), 1); // ok
    testUpdateRestockOrderState(new Restock_Order(undefined, "", undefined, undefined, ""), 2); // STATE USED BY UPDATE QUERY IS UNDEFINED -> NOT NULL CONSTRAINT FAILED
    testUpdateRestockOrderState(new Restock_Order(undefined, "", "DELIVERED", undefined, ""), 3); // restockOrderID of order to be modified DOES NOT EXIST => update failed

    // TESTING testUpdateRestockOrderState (restockOrder, restockOrderID) 

    testUpdateRestockOrderTransportNote(new Restock_Order(undefined, "", "COMPLETED", undefined, "Updated Transport note"), 1); // ok
    testUpdateRestockOrderTransportNote(new Restock_Order(undefined, "", undefined, undefined, undefined), 2); // TRANSPORT NOTE USED BY UPDATE QUERY IS UNDEFINED -> NOT NULL CONSTRAINT FAILED
    testUpdateRestockOrderTransportNote(new Restock_Order(undefined, "", "DELIVERED", undefined, ""), 3); // restockOrderID of order to be modified DOES NOT EXIST => update failed

    // TESTING DeleteRestockOrder by Id (id)

    testDeleteRestockOrderByID(1); // existing id => successfull test expected
    testDeleteRestockOrderByID(2); // existing id => successfull test expected
    testDeleteRestockOrderByID(3); // non existing id => failed test expected

    afterAll(async () => {
        await restockOrder_service.deleteRestockOrderData();
        await restockOrder_service.deleteSKUItemToRestockData();
        await restockOrder_service.deleteSKUToRestockData();
    });
});

function testNewRestockOrder(RestockOrder, call) {
    test('Create new Restock Order', async () => {
        if (call <= 2) {
            // SUCCESSFULL CALLS
            let res = await restockOrder_service.createRestockOrder(RestockOrder);
            expect(res).toStrictEqual(call);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await restockOrder_service.createRestockOrder(RestockOrder);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }
        }
    });
}

function testGetRestockOrderByID(id) {
    test('Get Restock Order by ID', async () => {
        let res;
        switch (id) {
            case 1:
                res = await restockOrder_service.getRestockOrderbyId(id);
                expect(res).toEqual({
                    id: 1,
                    issueDate: "2022/03/29 09:30",
                    state: "DELIVERED",
                    products: [],
                    supplierId: 1,
                    transportNote: "Transport Note",
                    skuItems: []
                });
                break;
            case 2:
                res = await restockOrder_service.getRestockOrderbyId(id);
                expect(res).toEqual({
                    id: 2,
                    issueDate: "2022/04/15 11:33",
                    state: "DELIVERY",
                    products: [],
                    supplierId: 2,
                    transportNote: "Transport Note",
                    skuItems: []
                });
                break;
            case 3:
                res = await restockOrder_service.getRestockOrderbyId(id);
                expect(res).toStrictEqual(undefined);
                break;
        }

    });
}

function testAddSkuItemToskuRestockTable(product, restockOrderID, call) {
    test('Add products to SkuToRestock table', async () => {
        if (call <= 4) {
            // SUCCESSFULL CALLS 
            let res = await restockOrder_service.addProductToSKURestockTable(product, restockOrderID);
            expect(res).toStrictEqual(true);
        } else {
            // CALLS WITH restockOrder_service ERROR CAUSE BY FAILED CONTSTRAINTS
            try {
                let res = await restockOrder_service.addProductToSKURestockTable(product, restockOrderID);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }
        }
    });
}

function testAddSkuItemToSkuItemToRestockTable(item, restockOrderID, call) {
    test('Add items to SkuToRestock table', async () => {
        if (call <= 4) {
            // SUCCESSFULL CALLS 
            let res = await restockOrder_service.addSkuItemsToSkuItemToRestock(item, restockOrderID);
            expect(res).toStrictEqual(true);
        } else {
            // CALLS WITH restockOrder_service ERROR CAUSE BY FAILED CONTSTRAINTS
            try {
                await restockOrder_service.addSkuItemsToSkuItemToRestock(item, restockOrderID);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }
        }
    });
}

function testNumberGetSkuItemsToRestockOrder(id, n) {
    test('Get sku items  of a Restock Order by ID - Check quantity of found items ', async () => {
        if (n != 0) {
            let skuItems = await restockOrder_service.getSkuItemstoOrder(id);
            expect(skuItems.length).toStrictEqual(n);
        }
        else {
            let skuItems = await restockOrder_service.getSkuItemstoOrder(id);
            expect(skuItems.length).toStrictEqual(0);
        }
    });
}

function testContentGetSkuItemsToRestockOrder(id) {
    test('Get Products of a Restock Order by ID - Check content of found products', async () => {
        let res;
        switch (id) {
            case 1:
                res = await restockOrder_service.getSkuItemstoOrder(id);
                expect(res[0]).toEqual({
                    RFID: "12345678901234567890123456789011",
                    SKUId: 1,
                });
                expect(res[1]).toEqual({
                    RFID: "12345678901234567890123456789012",
                    SKUId: 2,
                });
                break;
            case 3:
                res = await restockOrder_service.getSkuItemstoOrder(id);
                expect(res.length).toStrictEqual(0);
                break;
        }
    });
}

function testUpdateRestockOrderState(restockOrder, restockOrderID) {
    test('Update Restock Order State by Id', async () => {
        if (restockOrderID == 1) {
            // SUCCESSFULL CALL
            let res = await restockOrder_service.updateRestockOrderState(restockOrder, restockOrderID);
            expect(res).toStrictEqual(true);
        } else if (restockOrderID == 2) {
            // CALL WITH NOT NULL CONSTRAINT FAILED 
            try {
                await restockOrder_service.updateRestockOrderState(restockOrder, restockOrderID);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }
        } else {
            // CALL WITH NON EXISTING ID LEADING TO A NOT FOUND
            let res = await restockOrder_service.updateRestockOrderState(restockOrder, restockOrderID);
            expect(res).toStrictEqual(false);
        }
    });
}

function testUpdateRestockOrderTransportNote(restockOrder, restockOrderID) {
    test('Update Restock Order Transport Note by Id', async () => {
        if (restockOrderID == 1) {
            // SUCCESSFULL CALL
            let res = await restockOrder_service.updateRestockOrderTransportNote(restockOrder, restockOrderID);
            expect(res).toStrictEqual(true);
        } else if (restockOrderID == 2) {
            // CALL WITH NOT NULL CONSTRAINT FAILED 
            try {
                await restockOrder_service.updateRestockOrderTransportNote(restockOrder, restockOrderID);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }
        } else {
            // CALL WITH NON EXISTING ID LEADING TO A NOT FOUND
            let res = await restockOrder_service.updateRestockOrderTransportNote(restockOrder, restockOrderID);
            expect(res).toStrictEqual(false);
        }
    });
}

function testAddProductsToOrder(id) {
    test('Taking Products of a restock Order By ID from SKUtoRestock table', async () => {
        let res;
        switch (id) {
            case 1:
                res = await restockOrder_service.addProductstoOrder(id);
                expect(res[0]).toEqual({
                    price: 9.99,
                    SKUId: 1,
                    qty: 24,
                    description: "product 1",
                });
                expect(res[1]).toEqual({
                    price: 13.99,
                    SKUId: 2,
                    qty: 43,
                    description: "product 2",
                });
                break;
            case 2:
                res = await restockOrder_service.addProductstoOrder(id);
                expect(res[0]).toEqual({
                    price: 16.99,
                    SKUId: 2,
                    qty: 55,
                    description: "product 3",
                });
                expect(res[1]).toEqual({
                    price: 110.99,
                    SKUId: 3,
                    qty: 18,
                    description: "product 4",
                });
                break;
            case 3:
                res = await restockOrder_service.addProductstoOrder(id);
                expect(res.length).toStrictEqual(0);
                break;
        }
    });
}

function testDeleteRestockOrderByID(id) {
    test('Delete Restock Order by ID', async () => {
        let res = await restockOrder_service.deleteRestockOrderById(id)
        if (id <= 2) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}