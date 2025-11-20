'use strict';

const express = require('express');
const Sku_item = require('../models/Sku_Item');
const Sku_item_mapped = require('../models/Sku_Item_mapped');

const validation = require('../utilities/validationUtils');
//const app = require('../utilities/authenticationUtils');


const SkuItemService = require('../services/SkuItemService');
const skuItemDB = require('../database/SkuItemDB.js');
const skuItem_service = new SkuItemService(skuItemDB);

const SkuService = require('../services/SkuService')
const skuDB = require('../database/SkuDB.js');
const sku_service = new SkuService(skuDB);

let router = express.Router();

// ------------------------------------------------------------------------------------------------------------------------
//                                              SKU ITEM API
//-------------------------------------------------------------------------------------------------------------------------


//SKU ITEM LIST
router.get('/api/skuitems', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let skuitems = await skuItem_service.getSkuItemList(req.body);
        return res.status(200).json(skuitems).end();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }

});


//SKU ITEM LIST FOR CERTAIN SKU_ID WITH AVAILABLE=1
router.get('/api/skuitems/sku/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'customer') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (isNaN(validation.validate_params_value(req.params.id))) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }

        let sku = await sku_service.getSkuByID(req.params.id);
        if (sku === undefined)
            return res.status(404).json({ error: `Sku not found` }).end();

        let skuitems = await skuItem_service.getSkuItemListBySkuID(req.params.id);
        skuitems = skuitems.filter((a) => a.Available === 1);

        //ALTERNATIVA(NON CANCELLARE): skuitems = skuitems.map((a) => { return { RFID: a.RFID, SKUId: a.SKUId, DateOfStock: a.DateOfStock } });
        skuitems = skuitems.map((a) => new Sku_item_mapped(a.RFID, a.SKUId, a.DateOfStock));

        return res.status(200).json(skuitems);
    }
    catch (err) {
        return res.status(500).json({ error: `500 Internal Server Error` }).end();
    }
});

//SPECIFIC SKU ITEM BY RFID
router.get('/api/skuitems/:rfid', async (req, res) => {
    try {
        /* let type = app.getSessionType();
         if (type !== 'manager') {
             return res.status(401).json({ error: `Unauthorized user` }).end();
         }*/
        if (!validation.is_RFID_valid(req.params.rfid)) {
            return res.status(422).json({ error: `RFID not valid` }).end();
        }

        let skuitem = await skuItem_service.getSkuItemByRFID(req.params.rfid);
        if (skuitem === undefined) {
            return res.status(404).json({ error: 'Not Found' });
        }

        return res.status(200).json(skuitem);
    }
    catch (err) {
        return res.status(500).json({ error: `500 Internal Server Error` }).end();
    }
});

//CREATE SKU ITEM
router.post('/api/skuitem', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'clerk') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0)
            return res.status(422).json({ error: `Empty body request` }).end();

        if (!validation.is_RFID_valid(req.body.RFID))
            return res.status(422).json({ error: `RFID not valid` }).end();

        //TODO: check with validate number
        if (!validation.validate_defined_value(req.body.SKUId))
            return res.status(422).json({ error: `SKUId not valid` }).end();

        if (!validation.validate_date(req.body.DateOfStock))
            return res.status(422).json({ error: `Date not valid` }).end();

        let row = req.body;
        let sku = await sku_service.getSkuByID(row.SKUId);
        if (sku === undefined) {
            return res.status(404).json({ error: 'SKU not found' }).end();
        }
        //TODO: check if this is correct 
        //check if skuID (RFID) already exists
        let skuItem = await skuItem_service.getSkuItemByRFID(row.RFID);
        if (skuItem !== undefined) {
            return res.status(404).json({ error: 'RFID already present' }).end();
        }
        await skuItem_service.createSkuItem(new Sku_item(row.RFID, row.SKUId, row.DateOfStock));
        return res.status(201).end();
    }
    catch (err) {
        return res.status(503).json({ error: `Service Unavailable` }).end();
    }
});

//UPDATE SKU ITEM 
router.put('/api/skuitems/:rfid', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0)
            return res.status(422).json({ error: `Empty body request` }).end();

        if (!validation.is_RFID_valid(req.params.rfid))
            return res.status(422).json({ error: `RFID in link not valid` }).end();

        if (!validation.is_RFID_valid(req.body.newRFID))
            return res.status(422).json({ error: `RFID in body not valid` }).end();

        if (!validation.validate_available_value(req.body.newAvailable))
            return res.status(422).json({ error: `newAvailable in body not valid` }).end();

        if (!validation.validate_date(req.body.newDateOfStock))
            return res.status(422).json({ error: `Date not valid` }).end();


        let skuitem = await skuItem_service.getSkuItemByRFID(req.params.rfid);
        if (skuitem === undefined) {
            return res.status(404).json({ error: 'SkuItem Not Found' });
        }
        let fields = req.body;
        // The skuID can be undefined cause it's not updated!
        await skuItem_service.updateSkuItem(new Sku_item(fields.newRFID, undefined, fields.newDateOfStock, fields.newAvailable), req.params.rfid);
        return res.status(200).end();
    }
    catch (err) {
        console.error(err);
        return res.status(503).end();
    }

});


//DELETE SKU ITEM
router.delete('/api/skuitems/:rfid', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.is_RFID_valid(req.params.rfid)) {
            return res.status(422).json({ error: 'RFID NOT VALID' }).end();
        }

        let skuitem = await skuItem_service.getSkuItemByRFID(req.params.rfid);
        if (skuitem === undefined) {
            return res.status(404).json({ error: 'SkuItem Not Found' });
        }


        await skuItem_service.deleteSkuItemByRFID(req.params.rfid);
        return res.status(204).end();
    }
    catch (err) {
        return res.status(503).json({ error: 'Service unavaiable' }).end();
    }

});


module.exports = router;