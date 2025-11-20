'use strict';

//To check if the file exists
// const fs = require("fs");

const userDB = require('../database/UserDB.js');
const User = require('../models/User');



//Creates and populates the db.
async function createAndPopulate(database) {
    try {
        await createDB(database);
        let users = await userDB.getUserList();
        let count = 0;
        for (let user of users) {
            count++;
        }
        if (count === 0) {
            await populateUsers();
        }
    } catch (err) {
        console.error(err);
    }
    //ONLY FOR DEBUGGING
    //await populateDB(database);
}

//Creates the db tables.
async function createDB(database) {
    return new Promise(async (resolve, reject) => {
        try {
            await database.pragmaForeignKeys();
            await database.createSkuTable();
            await database.createSkuItemTable();
            await database.createPositionTable();
            await database.createTestDescriptorTable();
            await database.createTestResultTable();
            await database.createUserTable();
            await database.createItemTable();
            await database.createRestockOrderTable();
            await database.createRestockSupportTableforItemTable();
            await database.createRestockSupportTableforSKUTable();
            await database.createReturnOrderTable();
            await database.createReturnSupportTableforItemTable();
            await database.createInternalOrderTable();
            await database.createInternalSupportTableforSkuItemTable();
            await database.createInternalSupportTableforItemTable();
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });
}

//Hardcoded accounts
async function populateUsers() {
    return new Promise(async (resolve, reject) => {
        try {

            await userDB.createUser(new User(1, "user1name", "user1surname", "user1@ezwh.com", "testpassword", "customer"));
            await userDB.createUser(new User(2, "qualityEmployee1name", "qualityEmployee1surname", "qualityEmployee1@ezwh.com", "testpassword", "qualityEmployee"));
            await userDB.createUser(new User(3, "clerk1name", "clerk1surname", "clerk1@ezwh.com", "testpassword", "clerk"));
            await userDB.createUser(new User(4, "deliveryEmployee1name", "deliveryEmployee1surname", "deliveryEmployee1@ezwh.com", "testpassword", "deliveryEmployee"));
            await userDB.createUser(new User(5, "supplier1name", "supplier1surname", "supplier1@ezwh.com", "testpassword", "supplier"));
            await userDB.createUser(new User(6, "manager1name", "manager1surname", "manager1@ezwh.com", "testpassword", "manager"));
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });
}

/*
//ONLY FOR DEBUGGING!!! (population for testing)
async function populateDB(database) {
    return new Promise(async (resolve, reject) => {
        try {
            await database.createSku(new Sku("1", "a sku", 90, 75, "first SKU", 30, 5.99));
            await database.createSku(new Sku("2", "another sku", 101, 60, "second SKU", 55, 10.99));
            await database.createSku(new Sku("3", "another sku", 110, 55, "third SKU", 20, 14.99));
            await database.createSku(new Sku("12", "sku di prova per restock Order", 110, 55, "prova1", 10.99, 14.99));
            await database.createSku(new Sku("180", "sku di prova 2 per restock Order", 110, 55, "prova2", 11.99, 14.99));


            await database.createSkuItem(new Sku_item("12345678901234567890123456789011", "3", "2021/11/28 11:45"));
            await database.createSkuItem(new Sku_item("12345678901234567890123456789012", "1", "2021/11/29 16:45"));
            await database.createSkuItem(new Sku_item("12345678901234567890123456789013", "1", "2021/11/29 16:45"));
            await database.createSkuItem(new Sku_item("12345678901234567890123456789014", "2", "2021/11/29 12:30"));
            await database.createSkuItem(new Sku_item("12345678901234567890123456789015", "2", "2021/11/29 12:30"));
            //The following sku items are set with available = 1
            await database.createSkuItem(new Sku_item("12345678901234567890123456785515", "2", "2021/11/29 12:30", 1));
            await database.createSkuItem(new Sku_item("12345678901234567890123456784415", "3", "2021/11/29 12:30", 1));
            await database.createSkuItem(new Sku_item("12345678901234567890123456783315", "3", "2021/11/29 12:30", 1));
            await database.createSkuItem(new Sku_item("12345678901234567890123456787715", "1", "2021/11/29 12:30", 1));
            await database.createSkuItem(new Sku_item("12345678901234567890123456788815", "2", "2021/11/29 12:30", 1));

            await database.createSkuItem(new Sku_item("12345678901234567890123456789026", "12", "2021/11/29 12:30", 1));
            await database.createSkuItem(new Sku_item("12345678901234567890123456789017", "12", "2021/11/29 12:30", 1));
            await database.createSkuItem(new Sku_item("12345678901234567890111111111111", "180", "2021/11/29 12:30", 1));
            await database.createSkuItem(new Sku_item("12345678901234567890222222222222", "180", "2021/11/29 12:30", 1));


            await database.createSkuItem(new Sku_item("12345678901234567890123456789016", "1", "2021/11/29 12:30", 1));
            await database.createSkuItem(new Sku_item("12345678901234567890123456789038", "1", "2021/11/29 12:30", 1));



            await database.createPosition(new Position("800534543412", "8005", "3464", "3412", 1000, 1000, 120, 150));
            await database.createPosition(new Position("800234543412", "8002", "3454", "3412", 1000, 1000, 300, 350));
            await database.createPosition(new Position("801234543412", "8012", "3454", "3412", 1000, 1000, 360, 500));

            await database.createTestDescriptor(new Test_Descriptor(1, "Test descriptor 1", "Fake description of test descriptor 1", "1"));
            await database.createTestDescriptor(new Test_Descriptor(2, "Test descriptor 2", "Fake description of test descriptor 2", "1"));
            await database.createTestDescriptor(new Test_Descriptor(3, "Test descriptor 3", "Fake description of test descriptor 3", "2"));
            await database.createTestDescriptor(new Test_Descriptor(4, "Test descriptor 4", "Fake description of test descriptor 4", "3"));
            await database.createTestDescriptor(new Test_Descriptor(5, "Test descriptor 5", "Fake description of test descriptor 5", "2"));
            await database.createTestDescriptor(new Test_Descriptor(6, "Test descriptor 6", "Fake description for  restockorder", "12"));
            await database.createTestDescriptor(new Test_Descriptor(7, "Test descriptor 7", "Fake description for  restockorder 2", "180"));



            await database.createTestResult(new Test_result(1, 1, "2021/12/05", true), "12345678901234567890123456789012");
            await database.createTestResult(new Test_result(2, 2, "2021/12/05", true), "12345678901234567890123456789012");
            await database.createTestResult(new Test_result(3, 3, "2021/12/08", false), "12345678901234567890123456789016",);
            await database.createTestResult(new Test_result(4, 4, "2021/12/15", true), "12345678901234567890123456789017");
            await database.createTestResult(new Test_result(5, 5, "2021/12/19", false), "12345678901234567890123456789013");
            await database.createTestResult(new Test_result(6, 6, "2021/12/19", true), "12345678901234567890123456789013");
            await database.createTestResult(new Test_result(7, 7, "2021/12/19", false), "12345678901234567890123456789013");

            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });
}
*/


class Database {
    //!(fs.existsSync(dbName)
    //fs.existsSync()
    // fs.exists()
    // fs.accessSync()
    // fs.access()
    sqlite = require('sqlite3');
    db = undefined;

    constructor(dbName) {

        this.db = new this.sqlite.Database(dbName, (err) => {
            if (err) throw err;
        });

        createAndPopulate(this);

    }

    //#region CreateTable
    createSkuTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS SKU (id INTEGER NOT NULL, description TEXT, weight  NUMERIC NOT NULL, volume NUMERIC NOT NULL, notes TEXT, position TEXT, availableQuantity INTEGER, price NUMERIC NOT NULL, PRIMARY KEY (id) ON CONFLICT ROLLBACK)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        })
    }

    createSkuItemTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS SKUITEM(RFID  TEXT NOT NULL, SKUId INTEGER NOT NULL, Available  INTEGER NOT NULL, DateOfStock DATE NOT NULL, PRIMARY KEY (RFID) ON CONFLICT ROLLBACK,FOREIGN KEY (SKUid) REFERENCES SKU(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    createPositionTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS Position(positionID TEXT NOT NULL, aisleID TEXT NOT NULL, row  TEXT NOT NULL, col TEXT NOT NULL, maxWeight NUMERIC NOT NULL, maxVolume NUMERIC NOT NULL, occupiedWeight NUMERIC NOT NULL, occupiedVolume NUMERIC NOT NULL, PRIMARY KEY (positionID) ON CONFLICT ROLLBACK)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    createTestDescriptorTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS TestDescriptor(id INTEGER NOT NULL, name TEXT NOT NULL, procedureDescription  TEXT NOT NULL, idSKU INTEGER NOT NULL, PRIMARY KEY (id) ON CONFLICT ROLLBACK, FOREIGN KEY (idSKU) REFERENCES SKU(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    createTestResultTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS TestResult(id INTEGER NOT NULL, RFID TEXT NOT NULL, idTestDescriptor INTEGER NOT NULL, Date  DATE NOT NULL, Result BOOLEAN NOT NULL, PRIMARY KEY (id) ON CONFLICT ROLLBACK, FOREIGN KEY (idTestDescriptor) REFERENCES TestDescriptor(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }


    createUserTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS User(id INTEGER NOT NULL, name Text NOT NULL, surname  Text NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, type TEXT NOT NULL, PRIMARY KEY (id) ON CONFLICT ROLLBACK)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }


    createItemTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS Item(id INTEGER NOT NULL, description TEXT NOT NULL, price NUMERIC NOT NULL, SKUId INTEGER NOT NULL, supplierId INTEGER NOT NULL, PRIMARY KEY (id) ON CONFLICT ROLLBACK, FOREIGN KEY (skuID) REFERENCES SKU(id) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY(supplierid) REFERENCES User(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    //IMPORTANT: Table to track the products(SKUItems) in the RestockOrder are the next 2 after this
    createRestockOrderTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS RestockOrder(id INTEGER NOT NULL, issueDate Date NOT NULL, state  Text NOT NULL,supplierId INTEGER NOT NULL,transportNote TEXT NOT NULL, PRIMARY KEY (id) ON CONFLICT ROLLBACK, FOREIGN KEY (supplierID) REFERENCES User(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    createRestockSupportTableforItemTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS SkuItemToRestock(SKUId INTEGER NOT NULL,RFID TEXT NOT NULL, restockID INTEGER NOT NULL, PRIMARY KEY (RFID,restockID) ON CONFLICT ROLLBACK,  FOREIGN KEY (restockID) REFERENCES RestockOrder(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    createRestockSupportTableforSKUTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS SKUToRestock(SKUId INTEGER NOT NULL, restockID INTEGER NOT NULL, description TEXT, price NUMERIC NOT NULL, qty NUMERIC NOT NULL, PRIMARY KEY (skuID,restockID) ON CONFLICT ROLLBACK, FOREIGN KEY (skuID) REFERENCES SKU(ID) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (restockID) REFERENCES RestockOrder(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    //Same as RestockOrder
    createReturnOrderTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS ReturnOrder(id INTEGER NOT NULL, returnDate date NOT NULL, restockID INTEGER NOT NULL, PRIMARY KEY (id) ON CONFLICT ROLLBACK, FOREIGN KEY (restockID) REFERENCES RestockOrder(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }


    createReturnSupportTableforItemTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS SkuItemsToReturn(RFID TEXT NOT NULL, SKUId INTEGER NOT NULL, description TEXT , price NUMBER NOT NULL, returnOrderID INTEGER NOT NULL, PRIMARY KEY (RFID,returnOrderID) ON CONFLICT ROLLBACK, FOREIGN KEY (RFID) REFERENCES SKUITEM(RFID) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY(returnOrderID) REFERENCES ReturnOrder(id) ON UPDATE CASCADE ON DELETE CASCADE,FOREIGN KEY(SKUId) REFERENCES SKU(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    //Same as RestockOrder

    createInternalOrderTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS InternalOrder(id INTEGER NOT NULL , issueDate date NOT NULL,state TEXT NOT NULL, customerID INTEGER NOT NULL, PRIMARY KEY (id) ON CONFLICT ROLLBACK, FOREIGN KEY (customerID) REFERENCES User(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    createInternalSupportTableforSkuItemTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS SkuToInternal(SKUId INTEGER NOT NULL, internalID INTEGER NOT NULL, description TEXT, price NUMERIC NOT NULL, qty NUMERIC NOT NULL, PRIMARY KEY (skuID,internalID) ON CONFLICT ROLLBACK,  FOREIGN KEY (internalID) REFERENCES InternalOrder(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    createInternalSupportTableforItemTable() {

        return new Promise((resolve, reject) => {

            const sql = "CREATE TABLE IF NOT EXISTS SkuItemToInternal(SKUId INTEGER NOT NULL,RFID TEXT NOT NULL,description TEXT, price NUMBER NOT NULL, internalID INTEGER NOT NULL, PRIMARY KEY (RFID,internalID) ON CONFLICT ROLLBACK, FOREIGN KEY (internalID) REFERENCES InternalOrder(id) ON UPDATE CASCADE ON DELETE CASCADE)";

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }
    //#endregion CreateTable

    //pragma for foreign keys
    pragmaForeignKeys() {
        return new Promise((resolve, reject) => {
            const sql = 'PRAGMA foreign_keys = ON;';
            this.db.run(sql, [], function (err) {
                if (err) reject(err);
                else resolve(true)
            });

        });
    }

    getSessionType(username) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT *  FROM USER WHERE email=?';
            this.db.get(sql, [username], (err, row) => {
                if (err) reject(err);
                else {
                    if (row === undefined) resolve(row)
                    else resolve(row.type);
                }

            });

        })
    }

}

module.exports = Database;