'use strict';

const sqlite3 = require('sqlite3');
const Return_order = require('../models/Return_Order');
const Product_Return = require('../models/Product_Return');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});

exports.deleteReturnOrderData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RETURNORDER';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.deleteItemsToReturnData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUITEMSTORETURN';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.getReturnOrderList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM  ReturnOrder';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const orders = rows.map(row => {
                    return new Return_order(row.id, row.returnDate, parseInt(row.restockID));
                });
                resolve(orders);
            };
        });
    });
}

exports.getReturnOrderbyId = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM  ReturnOrder WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) resolve(row);
                else {
                    resolve(new Return_order(row.id, row.returnDate, parseInt(row.restockID)));
                }

            }
        });
    });
}

exports.getProductstoReturnOrder = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT RFID,SKUId,description,price FROM  SkuItemsToReturn WHERE returnOrderID=?';
        db.all(sql, [id], (err, rows) => {
            if (err) reject(err);
            else {
                const products = rows.map(row => {
                    let x = new Product_Return(row.SKUId, row.description, row.price, row.RFID);
                    return x;

                });
                resolve(products);
            };
        });
    });
}

exports.createReturnOrder = (returnorder) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO ReturnOrder(returnDate, restockID) VALUES(?,?)';
        db.run(sql, [returnorder.returnDate, returnorder.restockOrderId], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

exports.deleteReturnOrderById = async (id) => {
    let found = await this.getReturnOrderbyId(id);
    if (found) {
        await this.deleteSkuItemsToReturnByReturnID(id);
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ReturnOrder WHERE id=?';
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else {
        return false;
    }
}

exports.addSkuItemToSkuReturnTable = (prod, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SkuItemsToReturn(RFID,SKUId,description,price,returnOrderID) VALUES(?,?,?,?,?)';
        db.run(sql, [prod.RFID, prod.SKUId, prod.description, prod.price, id], (err, rows) => {
            if (err) reject(err);
            else {
                resolve(true);
            };
        });
    });
}

exports.deleteSkuItemsToReturnByReturnID = (returnOrderID) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUITEMSTORETURN where returnOrderID = ?';
        db.run(sql, [returnOrderID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};