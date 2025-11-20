'use strict';

const express = require('express');
const Sku = require('../models/Sku');

const validation = require('../utilities/validationUtils');

//const app = require('../utilities/authenticationUtils');


const SkuService = require('../services/SkuService')
const skuDB = require('../database/SkuDB.js');
const sku_service = new SkuService(skuDB);

const TestDescriptorService = require('../services/TestDescriptorService')
const testDescriptorDB = require('../database/TestDescriptorDB.js');
const testDescriptor_service = new TestDescriptorService(testDescriptorDB);

const PositionService = require('../services/PositionService')
const positionDB = require('../database/PositionDB.js');
const position_service = new PositionService(positionDB);

let router = express.Router();

// ------------------------------------------------------------------------------------------------------------------------
//                                              SKU API
//-------------------------------------------------------------------------------------------------------------------------

//SKUS LIST
router.get('/api/skus', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'customer' && type !== 'clerk') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let list = await sku_service.getSkuList();
        for (let sku of list) {
            let testDescriptors = await testDescriptor_service.getTestDescriptorsListBySKUId(sku.id);
            sku.testDescriptors = testDescriptors.map((td) => parseInt(td));
        }
        return res.status(200).json(list).end();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }
});


//SPECIFIC SKU
router.get('/api/skus/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let skuID = req.params.id;
        if (isNaN(validation.validate_params_value(skuID))) {
            return res.status(422).json({ error: `Validation of id failed` }).end();
        }
        let sku = await sku_service.getSkuByID(skuID);
        if (sku === undefined)
            return res.status(404).json({ error: `Sku not found` }).end();

        let testDescriptors = await testDescriptor_service.getTestDescriptorsListBySKUId(sku.id);
        sku.testDescriptors = testDescriptors.map((td) => parseInt(td));

        return res.status(200).json(sku.mapSku()).end();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }
});

//CREATE SKU
router.post('/api/sku', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Wrong or Empty body request` }).end();
        }

        if (!validation.validate_defined_value(req.body.description) || !validation.validate_string_value(req.body.description)) {
            return res.status(422).json({ error: `Wrong or empty description` }).end();
        }

        if (!validation.validate_integer_value(req.body.weight)) {
            return res.status(422).json({ error: `Wrong or empty weight` }).end();
        }

        if (!validation.validate_integer_value(req.body.volume)) {
            return res.status(422).json({ error: `Wrong or empty volume` }).end();
        }

        if (!validation.validate_defined_value(req.body.notes) || !validation.validate_string_value(req.body.notes)) {
            return res.status(422).json({ error: `Wrong or empty notes` }).end();
        }

        if (!validation.validate_number_value(req.body.price)) {
            return res.status(422).json({ error: `Wrong or empty price` }).end();
        }

        if (!validation.validate_integer_value(req.body.availableQuantity)) {
            return res.status(422).json({ error: `Wrong or empty available quantity` }).end();
        }
        let row = req.body;
        await sku_service.createSku(new Sku(undefined, row.description, row.weight, row.volume, row.notes, row.availableQuantity, row.price));
        return res.status(201).end();
    }
    catch (error) {
        console.log(error);
        return res.status(503).json({ error: 'Generic Error' }).end();
    }

});

//UPDATE SKU 
router.put('/api/sku/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }

        if (isNaN(validation.validate_params_value(req.params.id))) {
            return res.status(422).json({ error: `Validation of id failed` }).end();
        }

        if (!validation.validate_defined_value(req.body.newDescription) || !validation.validate_string_value(req.body.newDescription)) {
            return res.status(422).json({ error: `Wrong or empty description` }).end();
        }

        if (!validation.validate_number_value(req.body.newWeight)) {
            return res.status(422).json({ error: `Wrong or empty weight` }).end();
        }

        if (!validation.validate_number_value(req.body.newVolume)) {
            return res.status(422).json({ error: `Wrong or empty volume` }).end();
        }

        if (!validation.validate_defined_value(req.body.newNotes) || !validation.validate_string_value(req.body.newNotes)) {
            return res.status(422).json({ error: `Wrong or empty notes` }).end();
        }

        if (!validation.validate_number_value(req.body.newPrice)) {
            return res.status(422).json({ error: `Wrong or empty price` }).end();
        }

        if (!validation.validate_integer_value(req.body.newAvailableQuantity)) {
            return res.status(422).json({ error: `Wrong or empty available quantity` }).end();
        }

        let sku = await sku_service.getSkuByID(req.params.id);
        if (sku === undefined)
            return res.status(404).json({ error: `Sku not found` }).end();


        let row = req.body;

        if (sku.position !== null) {
            let newOccupiedWeight = row.newWeight * row.newAvailableQuantity;
            let newOccupiedVolume = row.newVolume * row.newAvailableQuantity;

            let position = await position_service.getPositions().find(pos => pos.positionID === sku.position);
            if (position.maxWeight < newOccupiedWeight || position.maxVolume < newOccupiedVolume) {
                return res.status(422).json({ error: `The new available quantity cannot satisfy the position constraints.` }).end();
            }

            await position_service.updatePositionOccupiedValues(sku.position, newOccupiedWeight, newOccupiedVolume);
        }
        await sku_service.updateSku(new Sku(undefined, row.newDescription, row.newWeight, row.newVolume, row.newNotes, row.newAvailableQuantity, row.newPrice), req.params.id);

        return res.status(200).end();
    } catch (err) {
        console.log(err);
        return res.status(503).json({ error: `Generic error` }).end();
    }
});


//UPDATE SKU POSITION
router.put('/api/sku/:id/position', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }

        if (isNaN(validation.validate_params_value(req.params.id))) {
            return res.status(422).json({ error: `Validation of sku id failed` }).end();
        }

        let newPositionID = req.body.position;
        if (!(validation.is_position_id_valid(newPositionID))) {
            return res.status(422).json({ error: `Validation of position id failed` }).end();
        }

        let sku = await sku_service.getSkuByID(req.params.id);
        if (sku === undefined) {
            return res.status(404).json({ error: `Sku not found` }).end();
        }

        let positions = await position_service.getPositions();
        let newPosition;// = positions.find(pos => pos.positionID === newPositionID)
        for (let pos of positions) {
            if (pos.positionID === newPositionID) {
                newPosition = pos;
            }
        }
        if (newPosition === undefined) {
            return res.status(404).json({ error: `Position not found` }).end();
        }

        if (newPosition.maxWeight < (newPosition.occupiedWeight + (sku.availableQuantity * sku.weight))
            || newPosition.maxVolume < (newPosition.occupiedVolume + (sku.availableQuantity * sku.volume))) {
            return res.status(422).json({ error: `The new position can't satisfy the volume and weight constraints for sku's available quantity` }).end();
        }

        if (sku.position === newPosition) {
            return res.status(422).json({ error: `This position is already assigned to this SKU` }).end();
        }

        let skus = await sku_service.getSkuList();
        if (skus.find(sku => sku.position === newPosition) !== undefined) {
            return res.status(422).json({ error: `This position is already assigned to another SKU` }).end();
        }

        await sku_service.updateSkuPosition(sku.id, newPositionID);

        let newOccupiedWeight = newPosition.occupiedWeight + sku.weight * sku.availableQuantity;
        let newOccupiedVolume = newPosition.occupiedVolume + sku.volume * sku.availableQuantity;
        await position_service.updatePositionOccupiedValues(newPositionID, newOccupiedWeight, newOccupiedVolume);


        return res.status(200).end();
    } catch (err) {
        console.log(err);
        return res.status(503).json({ error: `Generic error` }).end();
    }
});

//DELETE SKU 
router.delete('/api/skus/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/

        
        if (isNaN(validation.validate_params_value(req.params.id))) {
            return res.status(422).json({ error: `Validation of id failed` }).end();
        }

        await sku_service.deleteSkuByID(req.params.id);
        return res.status(204).end();
    } catch (err) {
        console.log(err);
        return res.status(503).json({ error: `Server Unavailable` }).end();
    }
});





module.exports = router;