'use strict';

const UserService = require('../services/UserService');
const userDB = require('../database/UserDB.js');
const user_service = new UserService(userDB);
const User = require('../models/User.js');



describe("USER Service - DB test", () => {
    beforeAll(async () => {
        await user_service.deleteUserData();
    });


    testCreateUser(new User(undefined, 'Marco', 'Rossi', 'mrossi@ezwh.com', 'testpassword', 'clerk'), 1);
    testCreateUser(new User(undefined, 'Luca', 'Verdi', 'lverdi@ezwh.com', 'testpassword', 'supplier'), 2);
    testCreateUser(new User(undefined, 'Francesco', 'Verdi', 'fverdi@ezwh.com', 'testpassword', 'supplier'), 3);
    testCreateUser(new User(undefined, 'Simone', 'Mascali', undefined, 'testpassword', 'clerk'), 4);

    testGetUserInfo('mrossi@ezwh.com', 1);
    testGetUserInfo('lverdi@ezwh.com', 2);
    testGetUserInfo('pippo@ezwh.com', 3);

    testSupplierList();
    testUserList();

    testGetUserByEmailAndPassword('mrossi@ezwh.com', 'testpassword', 1);
    testGetUserByEmailAndPassword('lverdi@ezwh.com', 'testpassword', 2);
    testGetUserByEmailAndPassword('pippo@ezwh.com', 'testpassword', 3);

    testGetUserByEmailAndType('mrossi@ezwh.com', 'clerk', 1);
    testGetUserByEmailAndType('lverdi@ezwh.com', 'supplier', 2);
    testGetUserByEmailAndType('pippo@ezwh.com', undefined, 3);

    testUpdateUser('mrossi@ezwh.com', 'deliveryEmployee', 1);
    testUpdateUser('lverdi@ezwh.com', 'supplier', 2);
    testUpdateUser('pippo@ezwh.com', undefined, 3);

    testDeleteUser('fverdi@ezwh.com', 'supplier', 1);
    testDeleteUser('lverdi@ezwh.com', 'supplier', 2);
    testDeleteUser('mrossi@ezwh.com', 'clerk', 3);

    afterAll(async () => {
        await user_service.deleteUserData();
        await user_service.createUser(new User(1, "user1name", "user1surname", "user1@ezwh.com", "testpassword", "customer"));
        await user_service.createUser(new User(2, "qualityEmployee1name", "qualityEmployee1surname", "qualityEmployee1@ezwh.com", "testpassword", "qualityEmployee"));
        await user_service.createUser(new User(3, "clerk1name", "clerk1surname", "clerk1@ezwh.com", "testpassword", "clerk"));
        await user_service.createUser(new User(4, "deliveryEmployee1name", "deliveryEmployee1surname", "deliveryEmployee1@ezwh.com", "testpassword", "deliveryEmployee"));
        await user_service.createUser(new User(5, "supplier1name", "supplier1surname", "supplier1@ezwh.com", "testpassword", "supplier"));
        await user_service.createUser(new User(6, "manager1name", "manager1surname", "manager1@ezwh.com", "testpassword", "manager"));
    });

});

function testCreateUser(user, call) {
    test('create User', async () => {
        if (call <= 3) {
            // SUCCESSFULL CALLS
            let res = await user_service.createUser(user);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await user_service.createUser(user);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }


        }
    });
};

function testUpdateUser(email, type, call) {
    test('update User', async () => {
        if (call <= 2) {
            // SUCCESSFULL CALLS
            let res = await user_service.updateUser(email, type);
            expect(res).toStrictEqual(true);
        } else {
            // CALL WITH EXPECTED ERROR IN DATABASE (ELEMENT CREATION WITH NOT NULL CONSTRAINT NOT SATISIFED)
            try {
                await user_service.updateUser(email, type);
            } catch (err) {
                let res = false;
                expect(res).toStrictEqual(false);
            }


        }
    });
};

function testDeleteUser(email, type, call) {
    test('delete User', async () => {
        let res = await user_service.deleteUser(email, type);
        if (call <= 2) {
            expect(res).toStrictEqual(true);
        }
        else {
            expect(res).toStrictEqual(false);
        }
    });
}

function testGetUserInfo(username, call) {
    test('get userInfo', async () => {
        let res;
        switch (call) {
            case 1:
                res = await user_service.getUserInfo(username);
                expect(res).toEqual({
                    id: 1,
                    name: "Marco",
                    surname: "Rossi",
                    email: "mrossi@ezwh.com",
                    type: "clerk"
                });
                break;
            case 2:
                res = await user_service.getUserInfo(username);
                expect(res).toEqual({
                    id: 2,
                    name: "Luca",
                    surname: "Verdi",
                    email: "lverdi@ezwh.com",
                    type: "supplier"
                });
                break;
            case 3:

                res = await user_service.getUserInfo(username);
                expect(res).toEqual(undefined);
                break;
        }
    });
};

function testSupplierList() {
    test('get supplier list', async () => {
        let res = await user_service.getSupplierList();
        expect(res).toEqual([{
            id: 2,
            name: "Luca",
            surname: "Verdi",
            email: "lverdi@ezwh.com"
        }, {
            id: 3,
            name: "Francesco",
            surname: "Verdi",
            email: "fverdi@ezwh.com"

        }]);
    });
};

function testUserList() {
    test('get user list', async () => {
        let res = await user_service.getUserList();
        expect(res).toEqual([{
            id: 1,
            name: "Marco",
            surname: "Rossi",
            email: "mrossi@ezwh.com",
            type: "clerk"
        }, {
            id: 2,
            name: "Luca",
            surname: "Verdi",
            email: "lverdi@ezwh.com",
            type: "supplier"
        }, {
            id: 3,
            name: "Francesco",
            surname: "Verdi",
            email: "fverdi@ezwh.com",
            type: "supplier"

        }]);
    });
};

function testGetUserByEmailAndPassword(username, password, call) {
    test('get User By Email And Password', async () => {
        let res;
        switch (call) {
            case 1:
                res = await user_service.getUserByEmailAndPassword(username, password);
                expect(res).toEqual({
                    id: 1,
                    name: "Marco",
                    surname: "Rossi",
                    email: "mrossi@ezwh.com",
                    type: "clerk"
                });
                break;
            case 2:
                res = await user_service.getUserByEmailAndPassword(username, password);
                expect(res).toEqual({
                    id: 2,
                    name: "Luca",
                    surname: "Verdi",
                    email: "lverdi@ezwh.com",
                    type: "supplier"
                });
                break;
            case 3:

                res = await user_service.getUserByEmailAndPassword(username, password);
                expect(res).toEqual(undefined);
                break;
        }
    });
};

function testGetUserByEmailAndType(email, type, call) {
    test('get User By email And type', async () => {
        let res;
        switch (call) {
            case 1:
                res = await user_service.getUserByEmailAndType(email, type);
                expect(res).toEqual({
                    id: 1,
                    name: "Marco",
                    surname: "Rossi",
                    email: "mrossi@ezwh.com",
                    type: "clerk"
                });
                break;
            case 2:
                res = await user_service.getUserByEmailAndType(email, type);
                expect(res).toEqual({
                    id: 2,
                    name: "Luca",
                    surname: "Verdi",
                    email: "lverdi@ezwh.com",
                    type: "supplier"
                });
                break;
            case 3:

                res = await user_service.getUserByEmailAndType(email, type);
                expect(res).toEqual(undefined);
                break;
        }
    });
};


