'use strict';

const sqlite3 = require('sqlite3');
const Test_result = require('../models/Test_Result');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});

exports.createTestResult = (testResult, rfid) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TESTRESULT(RFID,idTestDescriptor,Date,Result) VALUES( ?,?,?,?)';
        db.run(sql, [rfid, testResult.idTestDescriptor, testResult.Date, testResult.Result], function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

exports.updateTestResult = async (testResult, id) => {
    let found = await this.getTestResultById(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TESTRESULT SET idTestDescriptor=?, Date=?, Result=? WHERE id=?';
            db.run(sql, [testResult.idTestDescriptor, testResult.Date, testResult.Result, id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else {
        return false;
    }
}

exports.deleteTestResult = async (id) => {
    let found = await this.getTestResultById(id);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TESTRESULT WHERE id=?';
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });

        });
    } else {
        return false;
    }
}


exports.deleteTestResultData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM TESTRESULT';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.getTestResultListByRFID = (rfid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTRESULT WHERE rfid=?';
        db.all(sql, [rfid], (err, rows) => {
            if (err) reject(err);
            else {
                const testResultList = rows.map(row => new Test_result(row.id, row.idTestDescriptor, row.Date, row.Result ? true : false));
                resolve(testResultList);
            };
        });
    });
}

exports.getTestResultByIdAndRFID = (id, rfid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTRESULT WHERE id=? AND RFID=?';
        db.get(sql, [id, rfid], (err, row) => {
            if (err) reject(err);
            else {
                if (row != undefined) {
                    const testResult = new Test_result(row.id, row.idTestDescriptor, row.Date, row.Result ? true : false);
                    resolve(testResult);
                }
                else resolve(row);
            };
        });
    });
}

exports.getTestResultById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TESTRESULT WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else {
                if (row != undefined) {
                    const testResult = new Test_result(row.id, row.idTestDescriptor, row.Date, row.Result ? true : false);
                    resolve(testResult);
                }
                else resolve(row);
            };
        });
    });
}