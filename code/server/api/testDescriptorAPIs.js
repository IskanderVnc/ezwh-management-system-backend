'use strict';

const express = require('express');
const Test_descriptor = require('../models/Test_Descriptor');

const validation = require('../utilities/validationUtils');

//const Database = require('../database/database');
//const app = require('../utilities/authenticationUtils');

const TestDescriptorService = require('../services/TestDescriptorService')
const testDescriptorDB = require('../database/TestDescriptorDB.js');
const testDescriptor_service = new TestDescriptorService(testDescriptorDB);

const SkuService = require('../services/SkuService');
const skuDB = require('../database/SkuDB.js');
const sku_service = new SkuService(skuDB);

let router = express.Router();


// ------------------------------------------------------------------------------------------------------------------------
//                                              TEST DESCRIPTOR API
//-------------------------------------------------------------------------------------------------------------------------

//TD LIST
router.get('/api/testDescriptors', async (req, res) => {
  try {
    /*let type = app.getSessionType();
    if (type !== 'manager' && type !== 'qualityEmployee') {
      return res.status(401).json({ error: `Unauthorized user` }).end();
    }*/
    let list = await testDescriptor_service.getTestDescriptorsList();
    return res.status(200).json(list).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `500 Internal Server Error` }).end();
  }
});

//SPECIFIC TD
router.get('/api/testDescriptors/:id', async (req, res) => {
  try {
    /*let type = app.getSessionType();
    if (type !== 'manager') {
      return res.status(401).json({ error: `Unauthorized user` }).end();
    }*/
    if (!validation.validate_integer_value(req.params.id)) {
      return res.status(422).json({ error: `Validation of id failed` }).end();
    }
    let testDescriptor = await testDescriptor_service.getTestDescriptorById(req.params.id)
    if (testDescriptor === undefined)
      return res.status(404).json({ error: `No test descriptor associated id` }).end();
    return res.status(200).json(testDescriptor).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `500 Internal Server Error` }).end();
  }
});

//CREATE TD
router.post('/api/testDescriptor', async (req, res) => {

  try { 
    if (Object.keys(req.body).length === 0 || !(validation.validate_string_value(req.body.name) && validation.validate_string_value(req.body.procedureDescription)
      && validation.validate_integer_value(req.body.idSKU))) {
      return res.status(422).json({ error: `Validation of request body failed` }).end();
    }
    let sku = await sku_service.getSkuByID(req.body.idSKU);
    if (sku === undefined) {
      return res.status(404).json({ error: 'SKU not found' }).end();
    }
    let row = req.body;
    const result = await testDescriptor_service.createTestDescriptor(new Test_descriptor(undefined, row.name, row.procedureDescription, row.idSKU));
    if (result == true) {
      return res.status(201).end();
    }
  } catch (err) {
    console.log(err);
    return res.status(503).end();
  }
});

//UPDATE TD 
router.put('/api/testDescriptor/:id', async (req, res) => {

  try {
    /*let type = app.getSessionType();
    if (type !== 'manager' && type !== 'qualityEmployee') {
      return res.status(401).json({ error: `Unauthorized user` }).end();
    }*/

    if (!validation.validate_integer_value(req.params.id)) {
      return res.status(422).json({ error: `Validation of id failed` }).end();
    }
    if (Object.keys(req.body).length === 0 || !(validation.validate_string_value(req.body.newName) && validation.validate_string_value(req.body.newProcedureDescription) && validation.validate_integer_value(req.body.newIdSKU))) {
      return res.status(422).json({ error: `Validation of request body or of id failed` }).end();
    }
    let sku = await sku_service.getSkuByID(req.body.newIdSKU);
    if (sku === undefined) {
      return res.status(404).json({ error: 'SKU not found' }).end();
    }
    let row = req.body;
    const result = await testDescriptor_service.updateTestDescriptor(new Test_descriptor(req.params.id, row.newName, row.newProcedureDescription, row.newIdSKU), req.params.id);
    if (result === false)
      return res.status(404).json({ error: 'TD not found' }).end();
    else return res.status(200).end();
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
});

//DELETE TD 
router.delete('/api/testDescriptor/:id', async (req, res) => {
  try {
    /*let type = app.getSessionType();
    if (type !== 'manager' && type !== 'qualityEmployee') {
      return res.status(401).json({ error: `Unauthorized user` }).end();
    }*/
    if (!validation.validate_integer_value(req.params.id)) {
      return res.status(422).json({ error: `Validation of id failed` }).end();
    }
    let id = req.params.id;
    await testDescriptor_service.deleteTestDescriptor(id);
    return res.status(204).end();

  }
  catch (err) {
    console.log(err);
    return res.status(503).end();
  }
});

module.exports = router;