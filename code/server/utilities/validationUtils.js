'use strict';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

exports.onlyDigits = (s) => {
    for (let i = s.length - 1; i >= 0; i--) {
        const d = s.charCodeAt(i);
        if (d < 48 || d > 57) return false;
    }
    return true;
}

//sicuri sia giusto per un id? 
/*exports.is_sku_id_valid = (id) => {
    if (this.onlyDigits(id) && id.length === 12)
        return true;
    else
        return false;
}*/

exports.is_position_valid = (value) => {
    if (value !== undefined && this.onlyDigits(value) && value.length === 4)
        return true;
    else
        return false;
}

exports.is_position_id_valid = (value) => {
    if (value !== undefined && this.onlyDigits(value) && value.length === 12)
        return true;
    else
        return false;
}

exports.is_RFID_valid = (rfid) => {
    if (rfid !== undefined && rfid !== null && this.onlyDigits(rfid) && rfid.length === 32)
        return true;
    else return false;
}

//Validate a value that must be defined number and > 0
exports.validate_number_value = (value) => {
    if (value !== undefined && typeof value === "number" && value >= 0 )
        return true;
    return false;
}

//Validate a value that must be defined integer and >= 0
exports.validate_integer_value = (value) => {
    if (value !== undefined && value !== null && !isNaN(value) && value >= 0 && value % 1 === 0) {
        return true;
    }
    return false;
}

//Validate a value that must be defined
exports.validate_defined_value = (value) => {
    if (value === undefined || value === '' || value === null)
        return false;
    return true;
}

exports.validEmail = (e) => {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String(e).search (filter) != -1;
}

//Validate a value that must be defined
exports.validate_string_value = (value) => {
    if (value !== undefined && typeof value === "string")
        return true;
    return false;
}

//Validate a value that must be 1 or 0 (Available field)
exports.validate_available_value = (value) => {
    if (value !== undefined && (value === 0 || value === 1))
        return true;
    return false;
}


//Validate a params value that must be an integer id, otherwise returns undefined
exports.validate_params_value = (value) => {
    try {
        return parseInt(value);
    }
    catch (error) {
        return NaN;
    }
}

//Validate date, can be null but if exists the format must be "YYYY/MM/DD" or "YYYY/MM/DD HH:MM"
exports.validate_date = (value) => {
    if (value === null) {
        return true;
    }
    if (value === undefined) {
        return true;
    }
    if (!(dayjs(value, 'YYYY/MM/DD', true).isValid() || dayjs(value, 'YYYY/MM/DD HH:mm', true).isValid())) {
        return false;
    }
    return true;
}

//Checks if the user type is between the allowed
exports.validate_user_type = (type) => {
    if (type === undefined || (type !== "supplier" && type !== "customer" && type !== "qualityEmployee" && type !== "clerk" && type !== "deliveryEmployee")) {
        return false;
    }
    return true;
}

//Checks if the password is valid
exports.validate_password_value = (password) => {
    if (password !== undefined && typeof password === "string" && password.length >= 8)
        return true;
    return false;
}

//Checks if a user field value is valid (username, name, surname can't be of length 0)
exports.validate_string_user_value = (value) => {
    if (value !== undefined && value.length > 0)
        return true;
    return false;
}

/*
//Auto increments the lastID
exports.incrementID = (lastID) => {
    let newID;
    if (lastID == '') {
        newID = 1;
    } else {
        newID = parseInt(lastID);
        newID += 1;
    }
    return newID;
}*/