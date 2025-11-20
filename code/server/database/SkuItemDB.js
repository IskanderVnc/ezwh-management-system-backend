'use strict';

const sqlite3 = require('sqlite3');
const Sku_item = require('../models/Sku_Item');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});

exports.deleteSKUItemData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKUITEM';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.createSkuItem = (skuitem) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKUITEM( RFID,SKUid,Available,DateOfStock ) VALUES( ?, ?, ?, ?)';
        db.run(sql, [skuitem.RFID, skuitem.SKUId, skuitem.Available, skuitem.DateOfStock], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });

}

exports.getSkuItemList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT *  FROM SKUITEM';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const skuitems = rows.map(row => new Sku_item(row.RFID, row.SKUId, row.DateOfStock, row.Available))
                resolve(skuitems);
            }

        });

    });
}

exports.getSkuItemListBySkuID = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT *  FROM SKUITEM WHERE SKUid=?';
        db.all(sql, [id], (err, rows) => {
            if (err) reject(err);
            else {
                if (rows === undefined) {
                    resolve(rows);
                }
                else {
                    const skuitems = rows.map((a) => new Sku_item(a.RFID, a.SKUId, a.DateOfStock, a.Available));
                    resolve(skuitems);
                }
            }
        });
    });
}

exports.getSkuItemByRFID = (RFID) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT *  FROM SKUITEM WHERE RFID=?";
        db.get(sql, [RFID], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) {
                    resolve(row);
                }
                else {
                    const skuitem = new Sku_item(row.RFID, row.SKUId, row.DateOfStock, row.Available);
                    resolve(skuitem);
                }
            }
        });
    });
}

exports.deleteSkuItemByRFID = async (rfid) => {
    let found = await this.getSkuItemByRFID(rfid);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKUITEM WHERE RFID=?';
            db.run(sql, [rfid], function (err) {
                if (err) reject(err);
                else resolve(true);
            });

        });
    } else
        return false;
}

exports.updateSkuItem = async (skuitem, rfid) => {
    let found = await this.getSkuItemByRFID(rfid);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKUITEM SET RFID=?, available=?, DateOfStock=? WHERE RFID=?';
            db.run(sql, [skuitem.RFID, skuitem.Available, skuitem.DateOfStock, rfid], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else
        return false;
}