'use strict';

const Item = require('../models/Item');
const InternalOrder = require('../models/Internal_Order');
const Restock_Order = require('../models/Restock_Order')
const Return_Order = require('../models/Return_Order');

describe('Models functions - Test', () => {

    let products = ["product1", "product2", "product3"];
    let skuItems = ["skuItem1", "skuItem2", "skuItem3"];

    let initialStructuresTest = async function (products, skuItems) {
        test('Checking if useful data structures are present', () => {
            var res1 = products.length;
            var res2 = skuItems.length;
            expect(res1 + res2).toStrictEqual(6);
        });
    }

    initialStructuresTest(products, skuItems);

    // TESTING itemFunctions (item,functionName,setValueExpected)

    testItemFunctions(new Item(1, "", 0, 2, 1), "setDescription", "New description of item");
    testItemFunctions(new Item(1, "DescriptionOfItem", 0, 2, 1), "setPrice", 12.99);

    // TESTING internalOrderFunctions (internalOrder,functionName,setValueExpected)

    testInternalOrderFunctions(new InternalOrder(1, "2022/05/25 12:40", 2, 'ISSUED', []), "addProducts", products);
    testInternalOrderFunctions(new InternalOrder(1, "2022/05/25 12:40", 2, 'ISSUED', []), "setState", "COMPLETED");

    // TESTING returnOrderFunctions (returnOrder,functionName,setValueExpected)

    testReturnOrderFunctions(new Return_Order(1, "2022/05/25 12:40", 2, products = []), "addProducts", products);

    // TESTING restockOrderFunctions (restockOrder,functionName,setValueExpected)

    testRestockOrderFunctions(new Restock_Order(1, "2022/05/25 12:40", "ISSUED", 2), "addProducts", products);
    testRestockOrderFunctions(new Restock_Order(1, "2022/05/25 12:40", "ISSUED", 2), "addSkuItems", skuItems);
    testRestockOrderFunctions(new Restock_Order(1, "2022/05/25 12:40", "ISSUED", 2), "setState", "DEIVERED");
    testRestockOrderFunctions(new Restock_Order(1, "2022/05/25 12:40", "ISSUED", 2), "setTransportNote", "New Transport Note");
    let transportNote = '{ "deliveryDate:": "2021/12/29", "Issues": "None to report" }';
    const jsonTN = JSON.parse(transportNote);
    testRestockOrderFunctions(new Restock_Order(1, "2022/05/25 12:40", "ISSUED", 2, '{ "deliveryDate:": "2021/12/29", "Issues": "None to report" }'), "convertTransportNote", jsonTN);

});

function testItemFunctions(item, functionName, setValueExpected) {
    let testDescriptor = "Test item function : " + functionName;
    test(testDescriptor, async () => {
        switch (functionName) {
            case "setDescription":
                item.setDescription(setValueExpected);
                expect(item).toEqual({
                    id: 1,
                    description: setValueExpected,
                    price: 0,
                    SKUId: 2,
                    supplierId: 1,
                });
                break;
            case "setPrice":
                item.setPrice(setValueExpected);
                expect(item).toEqual({
                    id: 1,
                    description: "DescriptionOfItem",
                    price: setValueExpected,
                    SKUId: 2,
                    supplierId: 1,
                });
                break;
        }
    });
}

function testInternalOrderFunctions(internalOrder, functionName, setValueExpected) {
    let testDescriptor = "Test internalOrder function : " + functionName;
    test(testDescriptor, async () => {
        switch (functionName) {
            case "addProducts":
                internalOrder.addProducts(setValueExpected);
                expect(internalOrder.products.length).toStrictEqual(setValueExpected.length)
                break;
            case "setState":
                internalOrder.setState(setValueExpected);
                expect(internalOrder).toEqual({
                    id: 1,
                    issueDate: "2022/05/25 12:40",
                    state: setValueExpected,
                    products: [],
                    customerId: 2
                });
                break;
        }
    });
}

function testReturnOrderFunctions(returnOrder, functionName, setValueExpected) {
    let testDescriptor = "Test returnOrder function : " + functionName;
    test(testDescriptor, async () => {
        switch (functionName) {
            case "addProducts":
                returnOrder.addProducts(setValueExpected);
                expect(returnOrder.products.length).toStrictEqual(setValueExpected.length)
                break;
        }
    });
}

function testRestockOrderFunctions(restockOrder, functionName, setValueExpected) {
    let testDescriptor = "Test restockOrder function : " + functionName;
    test(testDescriptor, async () => {
        switch (functionName) {
            case "addProducts":
                restockOrder.addProducts(setValueExpected);
                expect(restockOrder.products.length).toStrictEqual(setValueExpected.length)
                break;
            case "addSkuItems":
                restockOrder.addSkuItems(setValueExpected);
                expect(restockOrder.skuItems.length).toStrictEqual(setValueExpected.length)
                break;
            case "setState":
                restockOrder.setState(setValueExpected);
                expect(restockOrder).toEqual({
                    id: 1,
                    issueDate: "2022/05/25 12:40",
                    state: setValueExpected,
                    products: [],
                    supplierId: 2,
                    transportNote: "",
                    skuItems: []
                });
                break;
            case "setTransportNote":
                restockOrder.setTransportNote(setValueExpected);
                expect(restockOrder).toEqual({
                    id: 1,
                    issueDate: "2022/05/25 12:40",
                    state: "ISSUED",
                    products: [],
                    supplierId: 2,
                    transportNote: setValueExpected,
                    skuItems: []
                });
                break;
            case "convertTransportNote":
                restockOrder.convertTransportNote();
                expect(restockOrder.transportNote.deliveryDate).toStrictEqual(setValueExpected.deliveryDate);
                expect(restockOrder.transportNote.Issues).toStrictEqual(setValueExpected.Issues);
                break;
        }
    });
}
