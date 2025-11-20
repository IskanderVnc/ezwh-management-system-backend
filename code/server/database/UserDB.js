'use strict';

const sqlite3 = require('sqlite3');
const User = require('../models/User');
const User_mapped = require('../models/User_Mapped');
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./database/EzWhDB.sqlite', (err) => {
    if (err) throw err;
});

exports.getUserInfo = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM USER WHERE email=?';
        db.get(sql, [username], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) resolve(row)
                else resolve(new User(row.id, row.name, row.surname, row.email, row.password, row.type).mapUser());
            }

        });

    })
}

exports.getSupplierList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM USER WHERE type="supplier"';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const suppliers = rows.map((row) => new User_mapped(row.id, row.name, row.surname, row.email).mapUser());
                resolve(suppliers);
            };
        });
    });
}

exports.getUserByEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM USER WHERE email=?';
        db.get(sql, [email], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) {
                    resolve(row);
                }
                else {
                    const user = new User_mapped(row.id, row.name, row.surname, row.email, row.type);
                    bcrypt.compare(password, row.password, function (err, result) {
                        if (err) {
                            resolve(undefined)
                        }
                        else {
                            if (result)
                                resolve(user);
                            else
                                resolve(undefined);
                        }
                    });

                }
            };
        });
    });
}

exports.deleteUserData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM USER';
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
};

exports.deleteUser = async (email, type) => {
    let found = await this.getUserByEmailAndType(email, type);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM USER WHERE email=? AND type=?';
            db.run(sql, [email, type], function (err) {
                if (err) reject(err);
                else resolve(true);
            });

        });
    } else
        return false
}

exports.getUserList = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM USER WHERE type!="manager"';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const suppliers = rows.map((row) => new User_mapped(row.id, row.name, row.surname, row.email, row.type));

                resolve(suppliers);
            };
        });
    });
}

exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.password, 10, async (err, hash) => {
            if (err) {
                console.error(err);
                resolve(false);
            }
            else {
                let hashedPassword = hash;
                const sql = 'INSERT INTO USER( name, surname, email, password, type) VALUES(?,?,?,?,?)';
                db.run(sql, [user.name, user.surname, user.email, hashedPassword, user.type], function (err) {
                    if (err) reject(err);
                    else resolve(true);
                });
            }

        });
    })
}

exports.updateUser = (email, type) => {
    let found = this.getUserByEmailAndType(email, type);
    if (found) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE USER SET type=? WHERE email=?';
            db.run(sql, [type, email], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    } else
        return false;
}

exports.getUserByEmailAndType = (email, type) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM USER WHERE email=? AND type=?';
        db.get(sql, [email, type], (err, row) => {
            if (err) reject(err);
            else {
                if (row === undefined) {
                    resolve(row);
                }
                else {
                    const user = new User_mapped(row.id, row.name, row.surname, row.email, row.type);
                    resolve(user);
                }
            };
        });
    });
}