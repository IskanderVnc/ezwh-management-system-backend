'use strict';

const Item = require('../models/Item');
const db = require('../database/ItemDB');


describe('Item - DB test', () => {

    beforeAll(async () => {
        await db.deleteItemData();
    });

    test('Checking if no items are present', async () => {
        var res = await db.getItemList();
        expect(res.length).toStrictEqual(0);
    });

    // TEST : New item

    testNewItem(new Item(undefined, "desc1", 10.99, 1, 2)); // ok
    testNewItem(new Item(undefined, "desc2", 11.99, 2, 1)); // ok
    testNewItem(new Item(undefined, "desc3", 13.99, 3, 2)); // ok
    testNewItem(new Item(undefined, undefined, 13.99, 3, 2));    // missing descr (NOT NULL CONSTRAINT FAILED)

    // TESTING Get items
    testGetItemList();

    // TESTING GetItem by Id

    testGetItemById(1);
    testGetItemById(2);
    testGetItemById(3);
    testGetItemById(4);

    // TESTING getIfSupplierSellItem
    testGetSpecific(2, 1, 1)
    testGetSpecific(2, 2, 2) //fail

    // TESTING getIfSupplierSellItem2
    testGetSpecific2(2, 1, 1);
    testGetSpecific2(1, 1, 2); //fail

    // TESTING UpdateItem by Id

    testUpdateItem(new Item(undefined, "desc1 modificata", 210.99, 1, 2), 1); // existing id => successfull test expected
    testUpdateItem(new Item(undefined, "desc2 modificata", 211.99, 2, 1), 2); // existing id => successfull test expected
    testUpdateItem(new Item(undefined, "desc3 modificata", 200.22, 3, 2), 3); // existing id => successfull test expected
    testUpdateItem(new Item(undefined, "desc4 modificata", 13.99, 3, 2), 4); // non existing id => failed test expected

    //// TESTING DeleteItem by Id

    testDeleteItem(1); // existing id => successfull test expected
    testDeleteItem(2); // existing id => successfull test expected
    testDeleteItem(3); // existing id => successfull test expected
    testDeleteItem(4); // non existing id => failed test expected

    afterAll(async () => {
        await db.deleteItemData();
    });

});

function testNewItem(item, call) {
    test('Create new item', async () => {

        if (call <= 3) {
            // SUCCESSFULL CALLS
            let res = await db.createItem(item);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await db.createItem(item);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}


function testGetItemList() {
    test('Get item LIST ', async () => {
        let items = await db.getItemList();
        expect(items.length).toStrictEqual(3);
    });
}

function testGetItemById(id) {
    test('Get item by id ', async () => {
        let item = await db.getItembyId(id);
        if (id <= 3) {
            expect(item.id).toStrictEqual(id);
        } else {
            let res = true;
            if (item === undefined)
                res = false;
            expect(res).toStrictEqual(false);
        }
    });
}

function testGetSpecific(suppID, skuID, call) {
    test('Get specific items', async () => {

        if (call === 1) {
            let res = await db.getIfSupplierSellItem(suppID, skuID);
            expect(res).toStrictEqual(true);
        }
        if (call === 2) {
            let res = await db.getIfSupplierSellItem(suppID, skuID);
            expect(res).toStrictEqual(false);
        }

    });
}

function testGetSpecific2(suppID, id, call) {
    test('Get specific2 items', async () => {

        if (call === 1) {
            let res = await db.getIfSupplierSellItem2(suppID, id);
            expect(res).toStrictEqual(true);
        }
        if (call === 2) {
            let res = await db.getIfSupplierSellItem2(suppID, id);
            expect(res).toStrictEqual(false);
        }
    });
}

function testUpdateItem(item, id) {

    test('Update item by item id', async () => {

        if (id <= 3) {
            let res = await db.updateItem(item, id);
            expect(res).toStrictEqual(true);
        } else {
            let res = await db.updateItem(item, id);
            expect(res).toStrictEqual(false);
        }
    });
}

function testDeleteItem(id) {
    test('Delete item (by item ID)', async () => {
        let res = await db.deleteItemByID(id);
        if (id <= 3) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}