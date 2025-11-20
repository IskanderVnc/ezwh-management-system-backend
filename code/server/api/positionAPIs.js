'use strict';

const express = require('express');
const Position = require('../models/Position');

const validation = require('../utilities/validationUtils');
//const app = require('../utilities/authenticationUtils');



const PositionService = require('../services/PositionService')
const positionDB = require('../database/PositionDB.js');
const position_service = new PositionService(positionDB);

let router = express.Router();


// ------------------------------------------------------------------------------------------------------------------------
//                                              POSITION API
//-------------------------------------------------------------------------------------------------------------------------


//POSITIONS LIST
router.get('/api/positions', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'clerk') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let positions = await position_service.getPositions();
        return res.status(200).json(positions).end();
    }
    catch (err) {
        return res.status(500).json({ error: `Internal Server Error` }).end();
    }

});


//CREATE POSITION
router.post('/api/position', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let fields = req.body;
        if (!validation.validate_defined_value(fields.positionID)) {
            return res.status(422).json({ error: `PositionID is not valid` }).end();
        }
        if (Object.keys(fields).length === 0 || !(validation.is_position_id_valid(fields.positionID) && validation.is_position_valid(fields.aisleID) && validation.is_position_valid(fields.row)
            && validation.is_position_valid(fields.col) && validation.validate_integer_value(fields.maxWeight) && validation.validate_integer_value(fields.maxVolume))) {
            return res.status(422).json({ error: `Unprocessable Entity` }).end();
        }
        // positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight = 0, occupiedVolume = 0
        await position_service.createPosition(new Position(fields.positionID, fields.aisleID, fields.row, fields.col, fields.maxWeight, fields.maxVolume));
        return res.status(201).end();
    }
    catch (err) {
        console.log(err);
        return res.status(503).json({ error: `Service Unavailable` }).end();
    }

});

//UPDATE POSITION 
router.put('/api/position/:positionID', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'clerk') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let fields = req.body;
        if (Object.keys(fields).length === 0 || !(validation.is_position_id_valid(req.params.positionID) && validation.is_position_valid(fields.newAisleID)
            && validation.is_position_valid(fields.newRow) && validation.is_position_valid(fields.newCol) && validation.validate_number_value(fields.newMaxWeight)
            && validation.validate_number_value(fields.newMaxVolume) && validation.validate_number_value(fields.newOccupiedWeight) && validation.validate_number_value(fields.newOccupiedVolume))) {
            return res.status(422).json({ error: `Unprocessable Entity` }).end();
        }
        let list = await position_service.getPositions();
        let found = list.find((position) => position.positionID === req.params.positionID)
        if (found === undefined) {
            return res.status(404).json({ error: 'Position Not Found' });
        }
        let newPositionID = fields.newAisleID + fields.newRow + fields.newCol;
        await position_service.updatePosition(new Position(newPositionID, fields.newAisleID, fields.newRow, fields.newCol, fields.newMaxWeight, fields.newMaxVolume, fields.newOccupiedWeight, fields.newOccupiedVolume), req.params.positionID);
        return res.status(200).end();
    } catch (err) {
        console.log(err);
        return res.status(503).json({ error: `Service Unavailable` }).end();
    }
});

//UPDATE POSITION_ID 
router.put('/api/position/:positionID/changeID', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` }).end();
        }
        if (!validation.is_position_id_valid(req.params.positionID)) {
            return res.status(422).json({ error: `PositionID not valid` }).end();
        }
        if (!validation.is_position_id_valid(req.body.newPositionID)) {
            return res.status(422).json({ error: `new PositionID not valid` }).end();
        }
        let list = await position_service.getPositions();
        let positionToBeModified = list.find((position) => position.positionID === req.params.positionID);
        if (positionToBeModified === undefined) {
            return res.status(404).json({ error: '404 : Position Not Found' });
        }
        let info = req.body;
        let newAisleID = info.newPositionID[0] + info.newPositionID[1] + info.newPositionID[2] + info.newPositionID[3];
        let newRow = info.newPositionID[4] + info.newPositionID[5] + info.newPositionID[6] + info.newPositionID[7];
        let newCol = info.newPositionID[8] + info.newPositionID[9] + info.newPositionID[10] + info.newPositionID[11];
        await position_service.updatePosition(new Position(info.newPositionID, newAisleID, newRow, newCol, positionToBeModified.maxWeight,
            positionToBeModified.maxVolume,
            positionToBeModified.occupiedWeight,
            positionToBeModified.occupiedVolume), req.params.positionID);
        return res.status(200).end();
    } catch (err) {
        console.log(err);
        return res.status(503).json({ error: `Service Unavailable` }).end();
    }

});

//DELETE POSITION 
router.delete('/api/position/:positionID', async (req, res) => {

    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.is_position_id_valid(req.params.positionID)) {
            return res.status(422).json({ error: `Position id not valid` }).end();
        }
        let id = req.params.positionID;
        await position_service.deletePositionById(id);
        return res.status(204).end();

    }
    catch (err) {
        console.log(err);
        return res.status(503).end();
    }
});

module.exports = router;