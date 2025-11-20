'use strict';

const express = require('express');
const User = require('../models/User');
const User_info = require('../models/User_Info');
const validation = require('../utilities/validationUtils');
//const app = require('../utilities/authenticationUtils');

const UserService = require('../services/UserService');
const userDB = require('../database/UserDB.js');
const user_service = new UserService(userDB);

let router = express.Router();

// ------------------------------------------------------------------------------------------------------------------------
//                                              USER API
//-------------------------------------------------------------------------------------------------------------------------

//USER INFO
router.get('/api/userinfo', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type === undefined) {
            return res.status(401).json({ error: `No user logged in` }).end();
        }*/
        //TODO: still unimplemented without the sessions part
        //let info = await user_service.getUserInfo(app.getUsername());
        //return res.status(200).json(info).end();

        return res.status(200).json({ error: 'Not yet implemented, cannot manage session.' }).end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Generic Error' }).end();
    }
});

//SUPPLIERS LIST
router.get('/api/suppliers', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let suppliers = await user_service.getSupplierList();
        if (suppliers === undefined) {
            return res.status(500).json({ error: 'Suppliers list is invalid' }).end();
        }
        return res.status(200).json(suppliers).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Generic Error' }).end();
    }
});

//USERS LIST
router.get('/api/users', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        let users = await user_service.getUserList();
        if (users === undefined) {
            return res.status(500).json({ error: 'Users list is invalid' }).end();
        }
        return res.status(200).json(users).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Generic Error' }).end();
    }
});

//CREATE USER
router.post('/api/newUser', async (req, res) => {
    // let lastID = await db.getLastIdFromTable('USER');
    // let userID = validation.incrementID(lastID);
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (Object.keys(req.body).length === 0 || !(validation.validEmail(req.body.username) && validation.validate_string_user_value(req.body.name)
            && validation.validate_string_user_value(req.body.surname) && validation.validate_password_value(req.body.password) && validation.validate_user_type(req.body.type))) {
            return res.status(422).json({ error: `Wrong or empty body request` }).end();
        }

        let fields = req.body;

        let user = await user_service.getUserByEmailAndType(fields.username, fields.type);
        if (user !== undefined) {
            return res.status(409).json({ error: `User with same email and type already exists` }).end();
        }

        await user_service.createUser(new User(undefined, fields.name, fields.surname, fields.username, fields.password, fields.type));

        return res.status(201).end();
    }
    catch (error) {
        console.log(error);
        return res.status(503).json({ error: 'Generic Error' }).end();
    }
});

//LOGIN 

router.post('/api/managerSessions', async (req, res) => {
    try {

        let fields = req.body;
        /*let type = await app.getSessionType(fields.username);
        app.setSessionType(type);
        app.setUsername(fields.username);*/

        if (Object.keys(fields).length === 0 || !(validation.validEmail(fields.username) && validation.validate_password_value(fields.password))) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }

        let user = await user_service.getUserByEmailAndPassword(fields.username, fields.password);
        if (user === undefined) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }
        if (user.type === undefined) {
            return res.status(500).json({ error: 'Generic Error' }).end();
        }
        if (user.type !== "manager") {
            return res.status(401).json({ error: `Unauthorized` }).end();
        }

        let userInfo = new User_info(user.id, user.email, user.name);

        return res.status(200).json(userInfo).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Generic Error' }).end();
    }
});

router.post('/api/customerSessions', async (req, res) => {
    try {
        let fields = req.body;
        /* let type = await app.getSessionType(fields.username);
         app.setSessionType(type);
         app.setUsername(fields.username);*/

        if (Object.keys(fields).length === 0 || !(validation.validEmail(fields.username) && validation.validate_password_value(fields.password))) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }

        let user = await user_service.getUserByEmailAndPassword(fields.username, fields.password);
        if (user === undefined) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }

        if (user.type === undefined) {
            return res.status(500).json({ error: 'Generic Error' }).end();
        }
        if (user.type !== "customer") {
            return res.status(401).json({ error: `Unauthorized` }).end();
        }
        let userInfo = new User_info(user.id, user.email, user.name);

        return res.status(200).json(userInfo).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Generic Error' }).end();
    }

});

router.post('/api/supplierSessions', async (req, res) => {
    try {

        let fields = req.body;
        /*let type = await app.getSessionType(fields.username);
        app.setSessionType(type);
        app.setUsername(fields.username);*/

        if (Object.keys(fields).length === 0 || !(validation.validEmail(fields.username) && validation.validate_password_value(fields.password))) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }

        let user = await user_service.getUserByEmailAndPassword(fields.username, fields.password);
        if (user === undefined) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }
        if (user.type === undefined) {
            return res.status(500).json({ error: 'Generic Error' }).end();
        }
        if (user.type !== "supplier") {
            return res.status(401).json({ error: `Unauthorized` }).end();
        }

        let userInfo = new User_info(user.id, user.email, user.name);

        return res.status(200).json(userInfo).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Generic Error' }).end();
    }

});

router.post('/api/clerkSessions', async (req, res) => {
    try {

        let fields = req.body;
        /*let type = await app.getSessionType(fields.username);
        app.setSessionType(type);
        app.setUsername(fields.username);*/

        if (Object.keys(fields).length === 0 || !(validation.validEmail(fields.username) && validation.validate_password_value(fields.password))) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }

        let user = await user_service.getUserByEmailAndPassword(fields.username, fields.password);
        if (user === undefined) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }
        if (user.type === undefined) {
            return res.status(500).json({ error: 'Generic Error' }).end();
        }
        if (user.type !== "clerk") {
            return res.status(401).json({ error: `Unauthorized` }).end();
        }

        let userInfo = new User_info(user.id, user.email, user.name);

        return res.status(200).json(userInfo).end();
    }
    catch (error) {
        console.log(error);
        return res.status(503).json({ error: 'Generic Error' }).end();
    }
});

router.post('/api/qualityEmployeeSessions', async (req, res) => {
    try {

        let fields = req.body;
        /*let type = await app.getSessionType(fields.username);
        app.setSessionType(type);
        app.setUsername(fields.username);*/

        if (Object.keys(fields).length === 0 || !(validation.validEmail(fields.username) && validation.validate_password_value(fields.password))) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }

        let user = await user_service.getUserByEmailAndPassword(fields.username, fields.password);
        if (user === undefined) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }
        if (user.type === undefined) {
            return res.status(500).json({ error: 'Generic Error' }).end();
        }
        if (user.type !== "qualityEmployee") {
            return res.status(401).json({ error: `Unauthorized` }).end();
        }

        let userInfo = new User_info(user.id, user.email, user.name);

        return res.status(200).json(userInfo).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Generic Error' }).end();
    }

});

router.post('/api/deliveryEmployeeSessions', async (req, res) => {
    try {

        let fields = req.body;
        /*let type = await app.getSessionType(fields.username);
        app.setSessionType(type);
        app.setUsername(fields.username);*/

        if (Object.keys(fields).length === 0 || !(validation.validEmail(fields.username) && validation.validate_password_value(fields.password))) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }

        let user = await user_service.getUserByEmailAndPassword(fields.username, fields.password);
        if (user === undefined) {
            return res.status(401).json({ error: `Wrong username and/or password` }).end();
        }
        if (user.type === undefined) {
            return res.status(500).json({ error: 'Generic Error' }).end();
        }
        if (user.type !== "deliveryEmployee") {
            return res.status(401).json({ error: `Unauthorized` }).end();
        }

        let userInfo = new User_info(user.id, user.email, user.name);

        return res.status(200).json(userInfo).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Generic Error' }).end();
    }


});

//LOGOUT 
router.post('/api/logout', (req, res) => {
    try {
        //app.setSessionType(undefined);
        return res.status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Generic Error' }).end();
    }
});

//UPDATE USER 
router.put('/api/users/:username', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/

        if (Object.keys(req.body).length === 0 || !(validation.validEmail(req.params.username) && req.body.oldType !== "manager" && req.body.oldType !== "administrator")) {
            return res.status(422).json({ error: `Empty or wrong body request` });
        }

        let user = await user_service.getUserByEmailAndType(req.params.username, req.body.oldType);
        if (user === undefined) {
            return res.status(404).json({ error: 'User not Found' });
        }

        await user_service.updateUser(req.params.username, req.body.newType);
        return res.status(200).end();
    }
    catch (err) {
        console.log(err);
        return res.status(503).json({ error: `Generic error` }).end();
    }
});

//DELETE USER 
router.delete('/api/users/:username/:type', async (req, res) => {
    try {
        /*let type = app.getSessionType();
        if (type !== 'manager') {
            return res.status(401).json({ error: `Unauthorized user` }).end();
        }*/
        if (req.params.type !== 'customer' && req.params.type !== 'qualityEmployee' && req.params.type !== 'clerk' && req.params.type !== 'deliveryEmployee' && req.params.type !== 'supplier')
            return res.status(422).json({ error: `Wrong type params` });
        if (!(validation.validEmail(req.params.username) && validation.validate_string_value(req.params.type) && req.params.type !== "manager" && req.params.type !== "administrator")) {
            return res.status(422).json({ error: `Empty or wrong body request` });
        }
        /*if (req.params.username === undefined) {
            return res.status(422).json({ error: 'username not defined in url' });
        }

        if (req.params.type === "manager" || req.params.type === "administrator") {
            return res.status(422).json({ error: 'Attempt to delete a manager or an administrator' });
        }*/

        await user_service.deleteUser(req.params.username, req.params.type);
        return res.status(204).end();
    }
    catch (err) {
        console.log(err);
        return res.status(503).json({ error: `Generic error` }).end();
    }
});

module.exports = router;