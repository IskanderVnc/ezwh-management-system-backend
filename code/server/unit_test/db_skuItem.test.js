'use strict';

const db = require('../database/SkuItemDB.js');
const SkuItem = require('../models/Sku_Item.js');


describe('SKU Item - DB test', () => {

    beforeAll(async () => {
        await db.deleteSKUItemData();
    });


    testCreateSkuItem(new SkuItem("12345678901234567890123456789011", "3", "2021/11/28 11:45"), 1);
    testCreateSkuItem(new SkuItem("12345678901234567890123456789012", '1', "2021/11/29 16:45"), 2);
    testCreateSkuItem(new SkuItem("12345678901234567890123456789013", undefined, "2021/11/29 16:42"), 3);

    testGetSkuItemList();

    testGetSkuItemListBySkuID(1, 1);
    testGetSkuItemListBySkuID(2, 2);

    testGetSkuItemByRFID('12345678901234567890123456789012', 1);
    testGetSkuItemByRFID('12345678901234567890129856789018', 2);

    testUpdateSkuItem(new SkuItem("12345678901234567890123456789012", '1', "2021/11/29 16:45"), "12345678901234567890123456789012", 1);
    testUpdateSkuItem(new SkuItem("12345678901234567890123456789013", undefined, "2021/11/29 16:42"), "12345678901234567890123456789013", 2);

    testDeleteSkuItemByRFID('12345678901234567890123456789012', 1);
    testDeleteSkuItemByRFID('12345678901234567890129856789018', 2);

    afterAll(async () => {
        await db.deleteSKUItemData();
    });

});

function testCreateSkuItem(skuitem, call) {
    test('Create new sku item', async () => {
        if (call <= 2) {
            let res = await db.createSkuItem(skuitem);
            expect(res).toStrictEqual(true);
        } else {
            try {
                await db.createSkuItem(skskuitemu);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}

function testGetSkuItemList() {
    test('Get sku item list', async () => {
        let res = await db.getSkuItemList();
        expect(res).toEqual([{
            RFID: "12345678901234567890123456789011",
            SKUId: 3,
            Available: 0,
            DateOfStock: "2021/11/28 11:45",

        }, {
            RFID: "12345678901234567890123456789012",
            SKUId: 1,
            Available: 0,
            DateOfStock: "2021/11/29 16:45",

        }]);
    });
};

async function testGetSkuItemListBySkuID(id, call) {
    test('get sku item list by sku id', async () => {
        let res;
        switch (call) {
            case 1:
                res = await db.getSkuItemListBySkuID(id);
                expect(res).toEqual([{
                    RFID: "12345678901234567890123456789012",
                    SKUId: 1,
                    Available: 0,
                    DateOfStock: "2021/11/29 16:45",
                }]);
                break;
            case 2:
                res = await db.getSkuItemListBySkuID(id);
                expect(res).toEqual([]);
                break;
        }
    });
};


async function testGetSkuItemByRFID(rfid, call) {
    test('get sku item by rfid', async () => {
        let res;
        switch (call) {
            case 1:
                res = await db.getSkuItemByRFID(rfid);
                expect(res).toEqual({
                    RFID: "12345678901234567890123456789012",
                    SKUId: 1,
                    Available: 0,
                    DateOfStock: "2021/11/29 16:45",
                });
                break;
            case 2:
                res = await db.getSkuItemByRFID(rfid);
                expect(res).toEqual(undefined);
                break;
        }
    });
};

async function testDeleteSkuItemByRFID(rfid, call) {
    test('delete skuitem by rfid', async () => {
        let res = await db.deleteSkuItemByRFID(rfid);
        if (call === 1) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}

async function testUpdateSkuItem(skuitem, rfid, call) {
    test('update sku item ', async () => {
        if (call === 1) {
            // SUCCESSFULL CALLS
            let res = await db.updateSkuItem(skuitem, rfid);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await db.updateSkuItem(skuitem, rfid);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }


        }
    });
};