'use strict';

const sqlite3 = require('sqlite3');
const Item = require('../models/Item');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});



exports.deleteItemData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM ITEM';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.getItemList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT *  FROM Item';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const items = rows.map(row => new Item(row.id, row.description, row.price, row.SKUId, row.supplierId))
                resolve(items);
            }

        });

    })
}

exports.getItembyId = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT *  FROM Item WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) resolve(row)
                else resolve(new Item(row.id, row.description, row.price, row.SKUId, row.supplierId))
            }
        });
    })
}

exports.createItem = (item) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Item(id,description,price,SKUId,supplierId) VALUES(?,?,?,?,?)';
        db.run(sql, [item.id, item.description, item.price, item.SKUId, item.supplierId], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

exports.updateItem = async (item, id) => {
    let found = await this.getItembyId(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE Item SET price=?,description=? WHERE id=?';
            db.run(sql, [item.price, item.description, id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else {
        return false;
    }
}

exports.deleteItemByID = async (id) => {
    let found = await this.getItembyId(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Item WHERE id=?';
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });

        });
    } else {
        return false;
    }
}

//THOSE 2 FUNCTIONS ARE FOR CHECKING THE GET /api/item (JUST A CHECK ON DB IF SUPPLIER SELLS ALREADY ITEMS)
exports.getIfSupplierSellItem = (suppID, skuID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM  Item WHERE SKUId=? AND supplierID=?';
        db.get(sql, [skuID, suppID], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) resolve(false);
                else resolve(true)
            }
        });
    })
};

exports.getIfSupplierSellItem2 = (suppID, itemID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM  Item WHERE id=? AND supplierID=?';
        db.get(sql, [itemID, suppID], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) resolve(false);
                else resolve(true)
            }
        });
    })
}