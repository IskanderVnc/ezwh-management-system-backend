'use strict';

const sqlite3 = require('sqlite3');
const Test_Descriptor = require('../models/Test_Descriptor');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});

exports.deleteTestDescriptorData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TESTDESCRIPTOR';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.getTestDescriptorsList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTDESCRIPTOR'
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                // id TEXT NOT NULL, name TEXT NOT NULL, procedureDescription  TEXT NOT NULL, idSKU TEXT NOT NULL
                const testDescriptor = rows.map(row => new Test_Descriptor(row.id, row.name, row.procedureDescription, row.idSKU));
                resolve(testDescriptor);
            };
        });
    })
}



exports.createTestDescriptor = (testDescriptor) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TESTDESCRIPTOR(name,procedureDescription,idSKU) VALUES(?,?,?)';
        db.run(sql, [testDescriptor.name, testDescriptor.procedureDescription, testDescriptor.idSKU], function (err) {
            if (err) {
                reject(err);
            }
            else resolve(true);
        });
    });
}

exports.getTestDescriptorById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTDESCRIPTOR WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) {
                    resolve(row);
                } else {
                    const testDescriptor = new Test_Descriptor(row.id, row.name, row.procedureDescription, row.idSKU);
                    resolve(testDescriptor);
                }
            };
        });
    });
}

exports.getTestDescriptorsListBySKUId = (idSKU) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTDESCRIPTOR WHERE idSKU=?';
        db.all(sql, [idSKU], (err, rows) => {
            if (err) reject(err);
            else {
                const testDescriptorsIdList = rows.map(row => row.id);
                resolve(testDescriptorsIdList);
            };
        });
    });
}

exports.updateTestDescriptor = async (testDescriptor, id) => {
    let found = await this.getTestDescriptorById(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TESTDESCRIPTOR SET name=?, procedureDescription=?, idSKU=? WHERE id=?';
            db.run(sql, [testDescriptor.name, testDescriptor.procedureDescription, testDescriptor.idSKU, id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }
    else {
        return false;
    }
}

exports.deleteTestDescriptor = async (id) => {
    let found = await this.getTestDescriptorById(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TESTDESCRIPTOR WHERE id=?';
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