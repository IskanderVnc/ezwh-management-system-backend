'use strict';

const express = require('express');
const Test_result = require('../models/Test_Result');

const validation = require('../utilities/validationUtils');

//const app = require('../utilities/authenticationUtils');


const TestResultService = require('../services/TestResultService');
const testResultDB = require('../database/TestResultDB.js');
const testResult_service = new TestResultService(testResultDB);


const SkuItemService = require('../services/SkuItemService');
const skuItemDB = require('../database/SkuItemDB.js');
const skuItem_service = new SkuItemService(skuItemDB);


const TestDescriptorService = require('../services/TestDescriptorService')
const testDescriptorDB = require('../database/TestDescriptorDB.js');
const testDescriptor_service = new TestDescriptorService(testDescriptorDB);


let router = express.Router();

// ------------------------------------------------------------------------------------------------------------------------
//                                              TEST RESULT API
//-------------------------------------------------------------------------------------------------------------------------


//TR LIST FOR CERTAIN SKU IDENTIFIED BY RFID
router.get('/api/skuitems/:rfid/testResults', async (req, res) => {
    try {

        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'qualityEmployee') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.is_RFID_valid(req.params.rfid)) {
            return res.status(422).json({ error: `Validation of rfid in req.parameters failed` }).end();
        }
        let skuitem = await skuItem_service.getSkuItemByRFID(req.params.rfid);
        if (skuitem === undefined) {
            return res.status(404).json({ error: 'Not Found : no sku item associated to rfid' });
        }
        let list = await testResult_service.getTestResultListByRFID(req.params.rfid);
        return res.status(200).json(list).end();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: `500 Internal Server Error` }).end();
    }
});

//SPECIFIC TR FOR CERTAIN SKU IDENTIFIED BY RFID
router.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'qualityEmployee') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.is_RFID_valid(req.params.rfid)) {
            return res.status(422).json({ error: `Validation of rfid in req.parameters failed` }).end();
        }
        if (!validation.validate_integer_value(req.params.id)) {
            return res.status(422).json({ error: `Validation of id in req.parameters failed` }).end();
        }
        let skuitem = await skuItem_service.getSkuItemByRFID(req.params.rfid);
        if (skuitem === undefined) {
            return res.status(404).json({ error: 'Not Found : no sku item associated to rfid' });
        }
        let testResult = await testResult_service.getTestResultByIdAndRFID(req.params.id, req.params.rfid);
        if (testResult === undefined) {
            return res.status(404).json({ error: 'Not Found : test Result with such id not found or RFID not associated to the requested test Result' });
        }
        return res.status(200).json(testResult).end();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: `500 Internal Server Error` }).end();
    }
});

//CREATE TR
router.post('/api/skuitems/testResult', async (req, res) => {
    // ---------------------------------------------------- COPY THIS BLOCK FOR ID SETTING IN CREATE APIS --------------------------------//
    // let lastID = await db.getLastIdFromTable('TESTRESULT');
    // let trID = validation.incrementID(lastID);
    // ---------------------------------------------------- COPY THIS BLOCK FOR ID SETTING IN CREATE APIS --------------------------------//
    try {
        /* let type = app.getSessionType();
         if (type !== 'manager' && type !== 'qualityEmployee') {
             return res.status(401).json({ error: `Unauthorized user` }).end();
         }*/

        if (!validation.is_RFID_valid(req.body.rfid)) {
            return res.status(422).json({ error: `Validation of rfid failed` }).end();
        }
        if (validation.validate_integer_value(req.body.idTestDescriptor) == false) {
            return res.status(422).json({ error: `Validation of idTestDescriptor failed` }).end();
        }
        if (Object.keys(req.body).length === 0 || !(validation.validate_integer_value(req.body.idTestDescriptor) && req.body.Date !== undefined && req.body.Result !== undefined)) {
            return res.status(422).json({ error: `Validation of request body` }).end();
        }
        let skuitem = await skuItem_service.getSkuItemByRFID(req.body.rfid);
        if (skuitem === undefined) {
            return res.status(404).json({ error: 'Not Found : no sku item associated to rfid' });
        }
        let testDescriptor = await testDescriptor_service.getTestDescriptorById(req.body.idTestDescriptor);
        if (testDescriptor === undefined) {
            return res.status(404).json({ error: `No test descriptor associated id` }).end();
        }
        let row = req.body;
        const result = await testResult_service.createTestResult(new Test_result(undefined, row.idTestDescriptor, row.Date, row.Result), row.rfid);
        if (result == true) {
            return res.status(201).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(503).end();
    }
});

//UPDATE TR FOR CERTAIN SKU IDENTIFIED BY RFID
router.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => {

    try {

        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'qualityEmployee') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.is_RFID_valid(req.params.rfid)) {
            return res.status(422).json({ error: `Validation of rfid in req.parameters failed` }).end();
        }
        if (!validation.validate_integer_value(req.params.id)) {
            return res.status(422).json({ error: `Validation of id in req.parameters failed` }).end();
        }
        if (Object.keys(req.body).length === 0 || !(validation.validate_integer_value(req.body.newIdTestDescriptor) && req.body.newDate !== undefined && req.body.newResult !== undefined)) {
            return res.status(422).json({ error: `Validation of request body failed` }).end();
        }
        let skuitem = await skuItem_service.getSkuItemByRFID(req.params.rfid);
        if (skuitem === undefined) {
            return res.status(404).json({ error: 'Not Found : no sku item associated to rfid' });
        }
        let testDescriptor = await testDescriptor_service.getTestDescriptorById(req.body.newIdTestDescriptor);
        if (testDescriptor === undefined) {
            return res.status(404).json({ error: `Not Found : newIdTestDescriptor does not match any existing Test Descriptor id` }).end();
        }
        let testResult = await testResult_service.getTestResultByIdAndRFID(req.params.id, req.params.rfid);
        if (testResult === undefined) {
            return res.status(404).json({ error: 'Not Found : test Result with such id not found or RFID not associated to the requested test Result' });
        }
        let row = req.body;
        const result = await testResult_service.updateTestResult(new Test_result(req.params.id, row.newIdTestDescriptor, row.newDate, row.newResult), req.params.id);
        if (result == true)
            return res.status(200).end();
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});


//DELETE TR FOR CERTAIN SKU IDENTIFIED BY RFID
router.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager' && type !== 'qualityEmployee') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (!validation.is_RFID_valid(req.params.rfid)) {
            return res.status(422).json({ error: `Validation of rfid in req.parameters failed` }).end();
        }
        if (!validation.validate_integer_value(req.params.id)) {
            return res.status(422).json({ error: `Validation of id in req.parameters failed` }).end();
        }
        if (req.params.rfid === undefined) {
            return res.status(422).json({ error: 'Validation of rfid in req.parameters failed' });
        }
        if (req.params.id === undefined) {
            return res.status(422).json({ error: 'Validation of id in req.parameters failed' });
        }
        let testResult = await testResult_service.getTestResultByIdAndRFID(req.params.id, req.params.rfid);
        if (testResult === undefined) {
            return res.status(404).json({ error: 'Not Found : no test result associated to id or no such RFID for the requested test result' });
        }
        let id = req.params.id;
        await testResult_service.deleteTestResult(id);
        return res.status(204).end();

    }
    catch (err) {
        console.log(err);
        return res.status(503).end();
    }
});

module.exports = router;