'use strict';

const sqlite3 = require('sqlite3');
const Position = require('../models/Position');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});


exports.updatePosition = async (position, positionID) => {
    let found = await this.getPositionById(positionID);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE POSITION SET positionID=?, aisleID=?, row=?, col=?, maxWeight=?, maxVolume=?, occupiedWeight=?, occupiedVolume=? WHERE positionID=?';
            db.run(sql, [position.positionID, position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume, position.occupiedWeight, position.occupiedVolume, positionID], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }
    else {
        return false;
    }
}

exports.deletePositionById = async (id) => {
    let found = await this.getPositionById(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM POSITION WHERE positionID=?';
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });

        });
    }
    else {
        return false;
    }
}

exports.getPositionById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM POSITION WHERE positionID=?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) {
                    resolve(row);
                } else {
                    const position = new Position(row.positionID, row.aisleID, row.row, row.col, row.maxWeight, row.maxVolume, row.occupiedWeight, row.occupiedVolume);
                    resolve(position);
                }
            };
        });
    });
}

exports.deletePositionData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM POSITION';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.getPositions = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM POSITION';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const positions = rows.map(row => new Position(row.positionID, row.aisleID, row.row, row.col, row.maxWeight, row.maxVolume, row.occupiedWeight, row.occupiedVolume));
                resolve(positions);
            };
        });
    });
}

exports.createPosition = (position) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO POSITION(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) VALUES( ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [position.positionID, position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume, position.occupiedWeight, position.occupiedVolume], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

exports.updatePositionOccupiedValues = async (newPositionID, newOccupiedWeight, newOccupiedVolume) => {
    let found = await this.getPositionById(newPositionID);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE POSITION SET occupiedWeight=?, occupiedVolume=? WHERE positionID=?';
            db.run(sql, [newOccupiedWeight, newOccupiedVolume, newPositionID], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }
    else {
        return false;
    }
}