'use strict';

const express = require('express');
const Return_order = require('../models/Return_Order');
const Product_Return = require('../models/Product_Return');
const validation = require('../utilities/validationUtils');

//const app = require('../utilities/authenticationUtils');


const ReturnOrderService = require('../services/ReturnOrderService')
const restockOrderDB = require('../database/RestockOrderDB');
const returnOrderDB = require('../database/ReturnOrderDB.js');
const return_order_service = new ReturnOrderService(returnOrderDB);

let router = express.Router();

// ------------------------------------------------------------------------------------------------------------------------
//                                              RETURN ORDER API
//-------------------------------------------------------------------------------------------------------------------------


//RO LIST
router.get('/api/returnOrders', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/

        let returnorders = await return_order_service.getReturnOrderList();
        for (let x of returnorders) {
            const products = await return_order_service.getProductstoReturnOrder(x.id);
            x.addProducts(products);
        };

        return res.status(200).json(returnorders).end();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }

});


//SPECIFIC RO
router.get('/api/returnOrders/:id', async (req, res) => {

    try {
        /* let type = app.getSessionType();
         if (type !== 'manager') {
             return res.status(401).json({ error: `Unauthorized user` }).end();
         }*/

        let returnorder = await return_order_service.getReturnOrderbyId(req.params.id);

        if (!validation.validate_defined_value(req.params.id) || req.params.id === "null") {
            return res.status(422).json({ error: `Wrong parameter` }).end();
        }

        if (returnorder === undefined) {
            return res.status(404).json({ error: "ReturnOrder Not Found" });
        }

        const products = await return_order_service.getProductstoReturnOrder(returnorder.id);
        returnorder.addProducts(products);

        return res.status(200).json(returnorder).end();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }

});

//CREATE RO
router.post('/api/returnOrder', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/


        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }
        if (!validation.validate_date(req.body.returnDate)) {
            return res.status(422).json({ error: `Issue Date Not Valid ` }).end();
        }

        if (req.body.products === undefined)
            return res.status(422).json({ error: `Products not defined in the call` }).end();

        if (req.body.restockOrderId === undefined || req.body.restockOrderId === 0)
            return res.status(422).json({ error: `Restock order id not valid` }).end();

        let x = await restockOrderDB.getRestockOrderbyId(req.body.restockOrderId);
        if (x === undefined) {
            return res.status(404).json({ error: 'RestockOrder not Found' });
        }

        // let lastID = await db.getLastIdFromTable('ReturnOrder');
        //  let trID = validation.incrementID(lastID);



        let order = new Return_order(undefined, req.body.returnDate, req.body.restockOrderId);
        const returnOderdId = await return_order_service.createReturnOrder(order);


        const products = req.body.products.map((x) => new Product_Return(x.SKUId, x.description, x.price, x.RFID));

        order.addProducts(products);

        for (let prod of products) {
            await return_order_service.addSkuItemToSkuReturnTable(prod, returnOderdId);
        }

        return res.status(201).end();
    }

    catch (err) {
        console.error(err);
        return res.status(503).end();
    }
});

//UPDATE RO 
// //IN THE API.MD IS NOT WRITTEN??  below PUT section there is nothing, probably it is not needed at all.
// router.put('/api/returnOrders/:id', (req, res) => {
//     if (Object.keys(req.body).length === 0) {
//         return res.status(422).json({ error: `Empty body request` });
//     }

//     let info = req.body;

//     // call db to update RO info

//     return res.status(200).end();
// });

//DELETE RO 
router.delete('/api/returnOrder/:id', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.validate_integer_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong id parameter` }).end();
        }

        await return_order_service.deleteReturnOrderById(req.params.id);
        return res.status(204).end();
    }
    catch (err) {
        return res.status(503).json({ error: 'Server Unavailable' }).end();
    }

});

module.exports = router;