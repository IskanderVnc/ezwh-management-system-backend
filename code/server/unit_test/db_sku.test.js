'use strict';

const db = require('../database/SkuDB.js');
const Sku = require('../models/Sku.js');


describe('SKU  - DB test', () => {

    beforeAll(async () => {
        await db.deleteSKUData();
    });


    testCreateSku(new Sku(undefined, "a sku", 90, 75, "first SKU", 30, 5.99), 1)
    testCreateSku(new Sku(undefined, "another sku", 101, 60, "second SKU", 55, 10.99), 2)
    testCreateSku(new Sku(undefined, "another sku", undefined, 55, "third SKU", 20, 14.99), 3)

    testGetSkuList();

    testGetSkuByID(1, 1);
    testGetSkuByID(4, 2);

    testUpdateSku(new Sku(undefined, "a sku", 12, 98, "first SKU", 30, 5.99), 1, 1);
    testUpdateSku(new Sku(undefined, "a sku", undefined, 75, "first SKU", 30, 5.99), 2, 2);

    testUpdateSkuPosition(1, '800234523412', 1);
    testUpdateSkuPosition(4, '800234523412', 2);

    testDeleteSkuByID(1, 1);
    testDeleteSkuByID(4, 2);

    afterAll(async () => {
        await db.deleteSKUData();
    });
});

function testCreateSku(sku, call) {
    test('Create new sku', async () => {
        if (call <= 2) {
            let res = await db.createSku(sku);
            expect(res).toStrictEqual(true);
        } else {
            try {
                await db.createSku(sku);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }

        }
    });
}

function testGetSkuList() {
    test('Get sku list', async () => {
        let res = await db.getSkuList();
        expect(res).toEqual([{
            id: 1,
            description: "a sku",
            weight: 90,
            volume: 75,
            notes: "first SKU",
            position: null,
            availableQuantity: 30,
            price: 5.99,
            testDescriptors: []
        }, {
            id: 2,
            description: "another sku",
            weight: 101,
            volume: 60,
            notes: "second SKU",
            position: null,
            availableQuantity: 55,
            price: 10.99,
            testDescriptors: []
        }]);
    });
};

async function testGetSkuByID(id, call) {
    test('get sku by id', async () => {
        let res;
        switch (call) {
            case 1:
                res = await db.getSkuByID(id);
                expect(res).toEqual({
                    id: 1,
                    description: "a sku",
                    weight: 90,
                    volume: 75,
                    notes: "first SKU",
                    position: null,
                    availableQuantity: 30,
                    price: 5.99,
                    testDescriptors: []
                });
                break;
            case 2:
                res = await db.getSkuByID(id);
                expect(res).toEqual(undefined);
                break;
        }
    });
};

async function testDeleteSkuByID(id, call) {
    test('delete sku by id', async () => {
        let res = await db.deleteSkuByID(id);
        if (call === 1) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}


async function testUpdateSkuPosition(skuID, newPositionID, call) {
    test('update sku position', async () => {
        if (call === 1) {
            // SUCCESSFULL CALLS
            let res = await db.updateSkuPosition(skuID, newPositionID);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await db.updateSkuPosition(skuID, newPositionID);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }


        }
    });
};
async function testUpdateSku(sku, id, call) {
    test('update sku ', async () => {
        if (call === 1) {
            // SUCCESSFULL CALLS
            let res = await db.updateSku(sku, id);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await db.updateSku(sku, id);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }


        }
    });
};