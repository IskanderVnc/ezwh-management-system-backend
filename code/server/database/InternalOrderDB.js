'use strict';

const sqlite3 = require('sqlite3');
const Internal_order = require('../models/Internal_Order');
const Product_Return = require('../models/Product_Return');
const Product = require('../models/Product');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});

exports.createInternalOrder = (internalorder) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO InternalOrder(issueDate, state, customerID) VALUES(?,?,?)';
        db.run(sql, [internalorder.issueDate, internalorder.state, internalorder.customerId], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

exports.updateInternalOrderState = async (state, id) => {
    let found = await this.getInternalOrderbyID(id)
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE InternalOrder SET state=? WHERE id=?';
            db.run(sql, [state, id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else
        return false;
}

exports.deleteInternalOrderById = async (id) => {
    let found = await this.getInternalOrderbyID(id);
    if (found) {
        await this.deleteSkuItemToInternalByID(id);
        await this.deleteSkuToInternalByID(id);
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM InternalOrder WHERE id=?';
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });

        });
    }
    else
        return false;
}

exports.deleteInternalOrderData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM INTERNALORDER';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.getInternalOrderList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM  InternalOrder';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const orders = rows.map(row => {
                    return new Internal_order(row.id, row.issueDate, row.customerID, row.state);
                });
                resolve(orders);
            };
        });
    });
}

exports.getInternalOrderbyID = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM InternalOrder WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) {
                    resolve(row);
                } else {
                    resolve(new Internal_order(row.id, row.issueDate, row.customerID, row.state));
                }
            };
        });
    });
}

exports.getsingleProductsCompletedtoInternalOrder = (SkuID, rfid, internalorderID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT SkuToInternal.SKUId,SKUITEM.RFID,SkuToInternal.description,SkuToInternal.price FROM SKUITEM,SkuToInternal  WHERE SKUITEM.SKUId=? AND SKUITEM.RFID=? AND SkuToInternal.internalID=? AND SkuToInternal.SKUId=SKUITEM.SKUId';
        db.get(sql, [SkuID, rfid, internalorderID], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined)
                    resolve(row);
                else
                    resolve(new Product_Return(row.SKUId, row.description, row.price, row.RFID));
            }
        });
    });
};

exports.getProductsIssuedtoInternalOrder = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT SKUId,description,price,qty FROM  SkuToInternal WHERE internalID=?';
        db.all(sql, [id], (err, rows) => {
            if (err) reject(err);
            else {
                const products = rows.map(row => {
                    let x = new Product(row.SKUId, row.description, row.price, row.qty);
                    return x;
                });
                resolve(products);
            };
        });
    });
}

exports.getProductsCompletedtoInternalOrder = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT SKUId,RFID,description,price FROM  SkuItemToInternal  WHERE internalID=? ';
        db.all(sql, [id], (err, rows) => {
            if (err) reject(err);
            else {

                let skuitems = rows.map(row => {
                    let x = new Product_Return(row.SKUId, row.description, row.price, row.RFID);
                    return x;
                });
                resolve(skuitems);

            };
        });
    });
}

exports.deleteSkuToInternalItem = async (skuid, id) => {
    let found = await this.getInternalOrderbyID(id);
    if (found) {

        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SkuToInternal WHERE internalID=? AND SKUId=?';
            db.run(sql, [id, skuid], function (err) {
                if (err) reject(err);
                else resolve(true);
            });

        });
    }
    else
        return false;
}

exports.createSkuItemToInternal = (item, id) => {

    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SkuItemToInternal(SKUId, RFID, description, price,internalID) VALUES(?,?,?,?,?)';
        db.run(sql, [item.SKUId, item.RFID, item.description, item.price, id], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

exports.addSkuItemToSkuInternalTable = (prod, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SkuToInternal(SKUId,description,price,qty,internalID) VALUES(?,?,?,?,?)';
        db.run(sql, [prod.SKUId, prod.description, prod.price, prod.qty, id], function (err) {
            if (err) reject(err);
            else {
                resolve(true);
            };
        });
    });
}

exports.deleteSkuToInternalData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUTOINTERNAL';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.deleteSkuItemToInternalData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUITEMTOINTERNAL';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.deleteSkuToInternalByID = (internalOrderID) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUTOINTERNAL where internalID = ?';
        db.run(sql, [internalOrderID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.deleteSkuItemToInternalByID = (internalOrderID) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SkuItemToInternal where internalID = ?';
        db.run(sql, [internalOrderID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};


exports.getPrice = (id, skuid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT PRICE FROM SkuToInternal WHERE skuID = ? AND internalID = ?  ';
        db.get(sql, [skuid, id], function (err, row) {
            if (err) reject(err);
            else if (row === undefined) resolve(row);
            else {
                resolve(row.price);
            }
        })
    })
};

exports.getDescription = (id, skuid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DESCRIPTION FROM SkuToInternal WHERE skuID = ? AND internalID = ? ';
        db.get(sql, [skuid, id], function (err, row) {
            if (err) reject(err);
            else if (row === undefined) resolve(row);
            else {
                resolve(row.description);
            }
        })
    })
};