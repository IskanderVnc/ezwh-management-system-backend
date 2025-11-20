'use strict';

const express = require('express');
const Internal_order = require('../models/Internal_Order');

const validation = require('../utilities/validationUtils');

//const app = require('../utilities/authenticationUtils');



const Product = require('../models/Product');
const Product_Return = require("../models/Product_Return");

const InternalOrderService = require('../services/InternalOrderService')
const internalOrderDB = require('../database/InternalOrderDB.js');
const internal_order_service = new InternalOrderService(internalOrderDB);


let router = express.Router();

// ------------------------------------------------------------------------------------------------------------------------
//                                              INTERNAL ORDER API
//-------------------------------------------------------------------------------------------------------------------------

//IO LIST
router.get('/api/internalOrders', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let internalorders = await internal_order_service.getInternalOrderList();
        for (let x of internalorders) {
            if (x.state !== "COMPLETED") {
                const products = await internal_order_service.getProductsIssuedtoInternalOrder(x.id);
                x.addProducts(products, 0);
            }
            else {
                const products = await internal_order_service.getProductsCompletedtoInternalOrder(x.id);
                x.addProducts(products, 0);
            }
        };
        return res.status(200).json(internalorders).end();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }
});


//IO_ISSUED LIST
router.get('/api/internalOrdersIssued', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'customer') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let internalorders = await internal_order_service.getInternalOrderList();
        for (let x of internalorders) {
            if (x.state !== "COMPLETED") {
                const products = await internal_order_service.getProductsIssuedtoInternalOrder(x.id);
                x.addProducts(products, 0);
            }
            else {
                const products = await internal_order_service.getProductsCompletedtoInternalOrder(x.id);
                x.addProducts(products, 0);
            }
        };

        internalorders = internalorders.filter((x) => x.state === "ISSUED");
        return res.status(200).json(internalorders).end();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

//IO_ACCEPTED LIST
router.get('/api/internalOrdersAccepted', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'deliveryEmployee') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let internalorders = await internal_order_service.getInternalOrderList();
        for (let x of internalorders) {
            if (x.state !== "COMPLETED") {
                const products = await internal_order_service.getProductsIssuedtoInternalOrder(x.id);
                x.addProducts(products, 0);
            }
            else {
                const products = await internal_order_service.getProductsCompletedtoInternalOrder(x.id);
                x.addProducts(products, 0);
            }
        };

        internalorders = internalorders.filter((x) => x.state === "ACCEPTED");
        return res.status(200).json(internalorders).end();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

//SPECIFIC IO
router.get('/api/internalOrders/:id', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'deliveryEmployee') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.validate_integer_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong ID parameter` }).end();
        }

        let internalorder = await internal_order_service.getInternalOrderbyID(req.params.id);
        if (internalorder === undefined) {
            return res.status(404).json({ error: `InternalOrder Not Found` }).end();
        }


        if (internalorder.state !== "COMPLETED") {
            const products = await internal_order_service.getProductsIssuedtoInternalOrder(internalorder.id);
            internalorder.addProducts(products, 0);
        }
        else {
            const products = await internal_order_service.getProductsCompletedtoInternalOrder(internalorder.id);
            internalorder.addProducts(products, 0);
        }

        return res.status(200).json(internalorder).end();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }

});

//CREATE IO
router.post('/api/internalOrders', async (req, res) => {
    try {
        /* let type = app.getSessionType();
         if (type !== 'manager' && type !== 'customer') {
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

        if (req.body.customerId === undefined || !validation.validate_integer_value(req.body.customerId))
            return res.status(422).json({ error: `CustomerId Not defined or not valid` }).end();

        // let lastID = await db.getLastIdFromTable('InternalOrder');
        // let trID = validation.incrementID(lastID);

        let order = new Internal_order(undefined, req.body.issueDate, req.body.customerId);
        const internalOrderID = await internal_order_service.createInternalOrder(order);
        const products = req.body.products.map((x) => new Product(x.SKUId, x.description, x.price, x.qty));

        order.addProducts(products, 0);
        for (let prod of products) {
            await internal_order_service.addSkuItemToSkuInternalTable(prod, internalOrderID);
        }

        return res.status(201).end();
    }

    catch (err) {
        console.error(err);
        return res.status(503).end();
    }
});


//UPDATE IO 
router.put('/api/internalOrders/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'deliveryEmployee') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }
        if (req.body.newState === undefined) {
            return res.status(422).json({ error: `New State Undefined` }).end();
        }
        if (req.body.newState !== "ISSUED" && req.body.newState !== "ACCEPTED" && req.body.newState !== "REFUSED" &&
            req.body.newState !== "CANCELED" && req.body.newState !== "COMPLETED") {
            return res.status(422).json({ error: `New State NOT Valid` }).end();

        }

        if (!validation.validate_defined_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong id parameter` }).end();
        }
        if (req.body.newState === "COMPLETED" && req.body.products === undefined) {
            return res.status(422).json({ error: `Missing Product body` }).end();
        }

        let internalorder = await internal_order_service.getInternalOrderbyID(req.params.id);

        if (internalorder === undefined) {
            return res.status(404).json({ error: "Internal Order Not Found" });
        }
        if (internalorder.state === "COMPLETED") //CHECK per evitare multeplici call ad un order già completo
        {
            return res.status(503).json({ error: "Order already in state COMPLETED" });
        }
        internalorder.setState(req.body.newState);

        await internal_order_service.updateInternalOrderState(internalorder.state, internalorder.id);

        if (internalorder.state === "COMPLETED") {
            let products = []
            let price = undefined;
            let desc = undefined;

            req.body.products.forEach(async (prod) => {
                price = await internal_order_service.getPrice(internalorder.id, prod.SkuID);
                desc = await internal_order_service.getDescription(internalorder.id, prod.SkuID);
                let prodotto = new Product_Return(prod.SkuID, desc, price, prod.RFID);
                await internal_order_service.createSkuItemToInternal(prodotto, internalorder.id);
                await internal_order_service.deleteSkuToInternalItem(prodotto.SKUId, internalorder.id);
                products.push(prodotto);
            });

            internalorder.addProducts(products, 1);

        }
        return res.status(200).end();

    }
    catch (err) {
        console.error(err);
        return res.status(503).json({ error: "Service unavailable" });
    }

});

//DELETE IO 
router.delete('/api/internalOrders/:id', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.validate_integer_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong id parameter` }).end();
        }

        await internal_order_service.deleteInternalOrderById(req.params.id);
        return res.status(204).end();
    }
    catch (err) {
        return res.status(503).json({ error: 'Server Unavailable' }).end();
    }

});

module.exports = router;