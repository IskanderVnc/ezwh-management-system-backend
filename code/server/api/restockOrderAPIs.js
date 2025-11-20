'use strict';

const express = require('express');
const Restock_order = require('../models/Restock_Order');
const Product = require('../models/Product');
const Sku_item_RestockOrder = require('../models/Sku_Item_RestockOrder');

const validation = require('../utilities/validationUtils');
//const app = require('../utilities/authenticationUtils');

const dayjs = require('dayjs');


const RestockOrderService = require('../services/RestockOrderService')
const restockOrderDB = require('../database/RestockOrderDB.js');
const restock_order_service = new RestockOrderService(restockOrderDB);

let router = express.Router();

// ------------------------------------------------------------------------------------------------------------------------
//                                              RESTOCK ORDER API
//-------------------------------------------------------------------------------------------------------------------------

//FOR ALL THE API: ADD ERROR 401 WHEN IS_LOGGED IN IS READY

//ReO LIST
router.get('/api/restockOrders', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'qualityEmployee' && type !== 'clerk') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        //all the codes to form the RestockOrder in the API format(great database sqlite XD)
        let restockorders = await restock_order_service.getRestockOrderList();
        for (let x of restockorders) {
            const products = await restock_order_service.addProductstoOrder(x.id);
            x.addProducts(products);
            const skuitems = await restock_order_service.getSkuItemstoOrder(x.id);
            x.addSkuItems(skuitems);
            x.convertTransportNote();
        };

        return res.status(200).json(restockorders).end();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }


});

//ReO_ISSUED LIST
router.get('/api/restockOrdersIssued', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'supplier') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let restockorders = await restock_order_service.getRestockOrderList();

        for (let x of restockorders) {
            const products = await restock_order_service.addProductstoOrder(x.id);
            x.addProducts(products);
            const skuitems = await restock_order_service.getSkuItemstoOrder(x.id);
            x.addSkuItems(skuitems);
            x.convertTransportNote();
        };
        restockorders = restockorders.filter((a) => a.state === "ISSUED");
        return res.status(200).json(restockorders);

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }
});


//SPECIFIC ReO
router.get('/api/restockOrders/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/

        if (!validation.validate_defined_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong parameter` }).end();
        }

        let restockorder = await restock_order_service.getRestockOrderbyId(req.params.id);

        if (restockorder === undefined) {
            return res.status(404).json({ error: `Restock Order Not Found` }).end();
        }

        const products = await restock_order_service.addProductstoOrder(req.params.id);

        restockorder.addProducts(products);
        const skuitems = await restock_order_service.getSkuItemstoOrder(req.params.id);


        restockorder.addSkuItems(skuitems);
        restockorder.convertTransportNote();

        return res.status(200).json(restockorder);

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

//SKU ITEMS TO BE RETURNED OF A RESTOCK ORDER
router.get('/api/restockOrders/:id/returnItems', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.validate_defined_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong parameter` }).end();
        }

        let restockorder = await restock_order_service.getRestockOrderbyId(req.params.id);

        if (restockorder === undefined) {
            return res.status(404).json({ error: `Restock Order Not Found` }).end();
        }


        const skuitems = await restock_order_service.getSkuItemstoReturn(req.params.id);
        return res.status(200).json(skuitems);
    }
    catch (err) {

        return res.status(503).end();
    }
});

//CREATE ReO

router.post('/api/restockOrder', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'supplier') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }

        if (!validation.validate_date(req.body.issueDate)) {
            return res.status(422).json({ error: `Issue Date Not Valid ` }).end();
        }

        if (req.body.products === undefined)
            return res.status(422).json({ error: `Products not defined in the call` }).end();

        if (req.body.supplierId === undefined)
            return res.status(422).json({ error: `SupplierId Not defined` }).end();
        if (!validation.validate_integer_value(req.body.supplierId)) {
            return res.status(422).json({ error: `SupplierId Not valid` }).end();
        }
        // let lastID = await db.getLastIdFromTable('RestockOrder');
        // let trID = validation.incrementID(lastID);

        let order = new Restock_order(undefined, req.body.issueDate, "ISSUED", req.body.supplierId, undefined);
        const restockOrderId = await restock_order_service.createRestockOrder(order);
        const products = req.body.products.map((x) => new Product(x.SKUId, x.description, x.price, x.qty));
        order.addProducts(products);
        for (let prod of products) {
            await restock_order_service.addProductToSKURestockTable(prod, restockOrderId);
        }
        return res.status(201).end();
    }

    catch (err) {
        console.log(err)
        return res.status(503).end();
    }

});


//UPDATE ReO STATE
router.put('/api/restockOrder/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'clerk') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }
        if (req.body.newState === undefined || req.body.newState === null) {
            return res.status(422).json({ error: `New State Undefined` }).end();
        }

        if (!validation.validate_defined_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong parameter` }).end();
        }
        let restockorder = await restock_order_service.getRestockOrderbyId(req.params.id);

        if (restockorder === undefined) {
            return res.status(404).json({ error: "Restock Order Not Found" });
        }
        restockorder.setState(req.body.newState);

        await restock_order_service.updateRestockOrderState(restockorder, restockorder.id);

        return res.status(200).end();

    }
    catch (err) {
        console.error(err);
        return res.status(503).json({ error: "Service unavaiable" });
    }

});

//UPDATE ReO ADDING ITEMS
router.put('/api/restockOrder/:id/skuItems', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'clerk') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }

        if (!validation.validate_defined_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong parameter` }).end();
        }
        if (req.body.skuItems === undefined) {
            return res.status(422).json({ error: `skuItems not defined` }).end();
        }

        let restockorder = await restock_order_service.getRestockOrderbyId(req.params.id);


        if (restockorder === undefined) {
            return res.status(404).json({ error: `Restock Order not found` }).end();

        }

        if (restockorder.state !== "DELIVERED") {
            return res.status(422).json({ error: `Order status is different from delivered` }).end();

        }

        for (let item of req.body.skuItems)
            await restock_order_service.addSkuItemsToSkuItemToRestock(new Sku_item_RestockOrder(item.rfid, item.SKUId), req.params.id);

        return res.status(200).end();

    }
    catch (err) {
        console.error(err);
        return res.status(503).json({ error: "Service unavaiable" });
    }

});

//UPDATE ReO TRANSPORT NOTE
router.put('/api/restockOrder/:id/transportNote', async (req, res) => {


    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'supplier') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }

        if (!validation.validate_defined_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong parameter` }).end();
        }
        if (req.body.transportNote === undefined) {
            return res.status(422).json({ error: `TransportNote not defined` }).end();
        }

        let restockorder = await restock_order_service.getRestockOrderbyId(req.params.id);


        if (restockorder === undefined) {
            return res.status(404).json({ error: `Restock Order not found` }).end();

        }

        if (restockorder.state !== "DELIVERY") {
            return res.status(422).json({ error: `Order status is different from delivery` }).end();

        }
        if (dayjs(req.body.transportNote.deliveryDate).isBefore(restockorder.issueDate)) {
            return res.status(422).json({ error: `Delivery date is before issueDate` }).end();
        }

        restockorder.setTransportNote(JSON.stringify(req.body.transportNote));
        await restock_order_service.updateRestockOrderTransportNote(restockorder, restockorder.id);
        return res.status(200).end();

    }
    catch (err) {
        console.error(err);
        return res.status(503).json({ error: "Service unavaiable" });
    }

});

//DELETE ReO 
router.delete('/api/restockOrder/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.validate_integer_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong id parameter` }).end();
        }
        let x = await restock_order_service.getRestockOrderbyId(req.params.id);

        if (x === undefined) {
            return res.status(404).json({ error: 'RestockOrder not found' });
        }

        await restock_order_service.deleteRestockOrderById(req.params.id);
        return res.status(204).end();
    }
    catch (err) {
        console.log(err);
        return res.status(503).json({ error: 'Server Unavailable' }).end();
    }
});

module.exports = router;