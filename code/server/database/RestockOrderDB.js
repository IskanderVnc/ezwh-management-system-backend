'use strict';

const sqlite3 = require('sqlite3');
const Restock_order = require('../models/Restock_Order');
const Sku_Item_RestockOrder = require('../models/Sku_Item_RestockOrder');
const Product = require('../models/Product');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});


exports.createRestockOrder = (restockorder) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RestockOrder(issueDate, state, supplierId, transportNote) VALUES(?,?,?,?)';
        db.run(sql, [restockorder.issueDate, restockorder.state, restockorder.supplierId, restockorder.transportNote], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });

}

exports.updateRestockOrderState = async (order, id) => {
    let found = await this.getRestockOrderbyId(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE RestockOrder SET state=? WHERE id=?';
            db.run(sql, [order.state, id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else {
        return false;
    }

}

exports.updateRestockOrderTransportNote = async (order, id) => {
    let found = await this.getRestockOrderbyId(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE RestockOrder SET transportNote=? WHERE id=?';
            db.run(sql, [order.transportNote, id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else {
        return false;
    }
}

exports.getRestockOrderList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM  RestockOrder';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const orders = rows.map(row => {

                    if (row.transportNote === "") {
                        return new Restock_order(row.id, row.issueDate, row.state, row.supplierId);
                    }
                    else return new Restock_order(row.id, row.issueDate, row.state, row.supplierId, row.transportNote);
                });
                resolve(orders);
            };
        });
    });
}

exports.getRestockOrderbyId = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM RestockOrder WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) {
                    resolve(row);
                } else {
                    if (row.transportNote === undefined) {
                        const x = new Restock_order(row.id, row.issueDate, row.state, row.supplierId);
                        resolve(x)
                    }
                    else {
                        const y = new Restock_order(row.id, row.issueDate, row.state, row.supplierId, row.transportNote);
                        resolve(y);
                    }
                }
            };
        });
    });
}

exports.getSkuItemstoOrder = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT SKUId,RFID FROM  SkuItemToRestock  WHERE restockID=? ';
        db.all(sql, [id], (err, rows) => {
            if (err) reject(err);
            else {

                let skuitems = rows.map(row => {
                    let x = new Sku_Item_RestockOrder(row.RFID, row.SKUId);
                    return x;
                });
                resolve(skuitems);

            };
        });
    });
}

exports.getSkuItemstoReturn = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT ITEM.SKUId,RFID FROM  SKUToRestock  SKU,SKUITEM ITEM WHERE restockID=? AND SKU.SKUId=ITEM.SKUId AND ITEM.SKUId NOT IN (SELECT TestDescriptor.idSKU FROM TestDescriptor,TestResult WHERE TestDescriptor.id=TestResult.idTestDescriptor AND TestResult.Result=FALSE)';
        db.all(sql, [id], (err, rows) => {
            if (err) reject(err);
            else {
                let skuitems = rows.map(row => {
                    let x = new Sku_Item_RestockOrder(row.RFID, row.SKUId);
                    return x;
                });
                resolve(skuitems);
            };
        });
    });
}

exports.addProductToSKURestockTable = (prod, restockID) => {
    //console.log("PUT SKUID : " + prod.SKUId);
    //console.log("PUT RESTOCKID : " + restockID);
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKUToRestock(SKUId,restockID,description,price,qty) VALUES(?,?,?,?,?)';
        db.run(sql, [prod.SKUId, restockID, prod.description, prod.price, prod.qty], (err, rows) => {
            if (err) reject(err);
            else {
                resolve(true);
            };
        });
    });

}

exports.addSkuItemsToSkuItemToRestock = (skuitem, restockID) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SkuItemToRestock(SKUId,RFID,restockID) VALUES(?,?,?)';
        db.run(sql, [skuitem.SKUId, skuitem.RFID, restockID], (err, rows) => {
            if (err) reject(err);
            else {
                resolve(true);
            };
        });
    });
}

exports.deleteRestockOrderById = async (id) => {
    let found = await this.getRestockOrderbyId(id);
    if (found) {
        await this.deleteSkuToRestockTableDataById(id);
        await this.deleteSkuItemToRestockTableDataById(id);
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RestockOrder WHERE id=?';
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });

        });
    } else {
        return false;
    }
}

exports.deleteRestockOrderData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RESTOCKORDER';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.deleteSkuToRestockTableDataById = (restockID) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUTORESTOCK where restockID = ?';
        db.run(sql, [restockID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.deleteSkuItemToRestockTableDataById = (restockID) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUITEMTORESTOCK where restockID = ?';
        db.run(sql, [restockID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.addProductstoOrder = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT SKUId,description,price,qty FROM  SKUToRestock WHERE restockID=?';
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

exports.deleteSKUItemToRestockData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUITEMTORESTOCK';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.deleteSKUToRestockData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUTORESTOCK';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};