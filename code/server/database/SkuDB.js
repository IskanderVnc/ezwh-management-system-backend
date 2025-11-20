'use strict';

const sqlite3 = require('sqlite3');
const Sku = require('../models/Sku');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});


exports.createSku = (sku) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKU(description, weight, volume, notes, availableQuantity, price ) VALUES(?, ?, ?, ?, ?, ?)';
        db.run(sql, [sku.description, sku.weight, sku.volume, sku.notes, sku.availableQuantity, sku.price], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });

}

exports.getSkuList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKU';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const skus = rows.map(row => new Sku(row.id, row.description, row.weight, row.volume, row.notes, row.availableQuantity, row.price, row.position));
                resolve(skus);
            };
        });
    });
}

exports.getSkuByID = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKU WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) {
                    resolve(row);
                } else {
                    const sku = new Sku(row.id, row.description, row.weight, row.volume, row.notes, row.availableQuantity, row.price, row.position);
                    resolve(sku);
                }
            };
        });
    });
}

exports.deleteSkuByID = async (id) => {
    let found = await this.getSkuByID(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKU WHERE id=?';
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });

        });
    } else
        return false;
}

exports.deleteSKUData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKU';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.updateSkuPosition = async (skuID, newPositionID) => {
    let found = await this.getSkuByID(skuID);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET position=? WHERE id=?';
            db.run(sql, [newPositionID, skuID], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else
        return false;
}

exports.updateSku = async (sku, id) => {
    let found = await this.getSkuByID(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET description=?, weight=?, volume=?, notes=?, availableQuantity=?, price=? WHERE id=?';
            db.run(sql, [sku.description, sku.weight, sku.volume, sku.notes, sku.availableQuantity, sku.price, id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else
        return false;
}