'use strict';

const express = require('express');
const Item = require('../models/Item');

const validation = require('../utilities/validationUtils');
//const app = require('../utilities/authenticationUtils');


const ItemService = require('../services/ItemService')
const itemDB = require('../database/ItemDB.js');
const item_service = new ItemService(itemDB);

const SkuService = require('../services/SkuService')
const skuDB = require('../database/SkuDB.js');
const sku_service = new SkuService(skuDB);

let router = express.Router();

// ------------------------------------------------------------------------------------------------------------------------
//                                              ITEM API
//-------------------------------------------------------------------------------------------------------------------------

//ITEMs LIST
router.get('/api/items', async (req, res) => {
    try {
        /* let type = app.getSessionType();
         if (type !== 'manager' && type !== 'supplier') {
             return res.status(401).json({ error: `Unauthorized user` }).end();
         }*/
        let items = await item_service.getItemList();
        return res.status(200).json(items).end();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

//SPECIFIC ITEM
router.get('/api/items/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        
        if(req.params.id === 'null') {
            return res.status(422).json({ error: `Param Id not Defined` }).end();
        }

        if (!validation.validate_defined_value(req.params.id)) {
            return res.status(422).json({ error: `Param Id not Defined` }).end();
        }

        let item = await item_service.getItembyId(req.params.id);
        if (item === undefined) {
            return res.status(404).json({ error: "Item Not Found" });
        }


        return res.status(200).json(item).end();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

//CREATE ITEM
router.post('/api/item', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'supplier') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` });
        }

        if (req.body.id === undefined) {
            return res.status(422).json({ error: `Item id undefined` });

        }
        if (req.body.description === undefined) {
            return res.status(422).json({ error: `Item description undefined` });

        }
        if (req.body.price === undefined) {
            return res.status(422).json({ error: `Item price undefined` });

        }
        if (req.body.SKUId === undefined) {
            return res.status(422).json({ error: `Item SKUId undefined` });

        }
        if (req.body.supplierId === undefined) {
            return res.status(422).json({ error: `Item supplierId undefined` });
        }
        let result = await item_service.getIfSupplierSellItem(req.body.supplierId, req.body.SKUId);
        if (result === true) {
            return res.status(422).json({ error: `Supplier already sells item with same SKUid` });

        }
        let result2 = await item_service.getIfSupplierSellItem2(req.body.supplierId, req.body.id)
        if (result2 === true) {
            return res.status(422).json({ error: `Supplier already sells item with same ItemID` });

        }


        let sku = await sku_service.getSkuByID(req.body.SKUId);
        if (sku === undefined) {
            return res.status(404).json({ error: "SKU NOT FOUND" });
        }

        let item = new Item(req.body.id, req.body.description, req.body.price, req.body.SKUId, req.body.supplierId);
        await item_service.createItem(item);
        return res.status(201).end();
    }
    catch (err) {
        console.error(err);
        return res.status(503).json({ error: "Service unavaiable" });
    }

});

//UPDATE ITEM 
router.put('/api/item/:id', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'supplier') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` });
        }

        if (!(validation.validate_defined_value(req.params.id) && validation.validate_integer_value(req.params.id))) {
            return res.status(422).json({ error: `Wrong id parameter` }).end();
        }


        if (req.body.newDescription === undefined) {
            return res.status(422).json({ error: "newDescription not defined" });
        }

        if (req.body.newPrice === undefined) {
            return res.status(422).json({ error: "newPrice not defined" });
        }
        if (!validation.validate_number_value(req.body.newPrice)) {
            return res.status(422).json({ error: "newPrice is not valid" });
        }
        let item = await item_service.getItembyId(req.params.id);

        if (item === undefined) {
            return res.status(404).json({ error: "Item Not Found" });
        }

        item.setDescription(req.body.newDescription);
        item.setPrice(req.body.newPrice);

        await item_service.updateItem(item, req.params.id);

        return res.status(200).end();

    }
    catch (err) {
        console.error(err);
        return res.status(503).json({ error: "Service unavaiable" });
    }
});

//DELETE ITEM 
router.delete('/api/items/:id', async (req, res) => {

    try {
        /* let type = app.getSessionType();
         if (type !== 'supplier') {
             return res.status(401).json({ error: `Unauthorized user` }).end();
         }*/
        if (!validation.validate_integer_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong id parameter (not an integer)` }).end();
        }
        if (!validation.validate_defined_value(req.params.id)) {
            return res.status(422).json({ error: `Wrong id parameter` }).end();
        }
        await item_service.deleteItemByID(req.params.id);

        return res.status(204).end();
    }
    catch (err) {
        return res.status(503).json({ error: 'Server Unavailable' }).end();
    }

});

module.exports = router;