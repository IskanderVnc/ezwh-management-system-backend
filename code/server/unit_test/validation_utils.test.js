'use strict';

const validation = require('../utilities/validationUtils');

describe('Validation utils - test', () => {

    test_OnlyDigits("1234567", true); // valid
    test_OnlyDigits("abvc23125s", false); // not valid (letters among digits)

    test_is_position_valid("1234", true); // valid : 4 digits
    test_is_position_valid("a2bc", false); // not valid : letters among digits
    test_is_position_valid("2", false); // not valid : only digits but length lower than 4 digits
    test_is_position_valid("12345", false) // not valid : only digits but length higher than 4 
    test_is_position_valid(undefined, false); // not valid : undefined

    test_is_position_id_valid("123456789123", true); // valid : 12 digits
    test_is_position_id_valid("123456789", false); // not valid : only digits but length lower than 12 
    test_is_position_id_valid("123a123b123c", false); // not valid : correct length but letters among digits
    test_is_position_id_valid(undefined, false); // not valid : undefined 

    test_is_RFID_valid("12345678901234567890123456789011", true); // valid : only digit and correct length = 32 digits
    test_is_RFID_valid("1234567890123456789012345678901", false); // not valid : only digits but length lower than 32 
    test_is_RFID_valid("123456789012345678901234567890112", false); // not valid : only digits but length higher than 32
    test_is_RFID_valid("12345a789012345678vbc01456789011", false); // not valid : letters among digits
    test_is_RFID_valid(undefined, false); // not valid : undefined

    test_validate_number_value(15, true); // valid : number
    test_validate_number_value("15", false); // not valid : string
    test_validate_number_value(-5, false); // not valid : negative number
    test_validate_number_value(undefined, false); // not valid : undefined

    test_validate_integer_value(15, true); // valid 
    test_validate_integer_value("string", false); // not valid : string
    test_validate_integer_value(undefined, false); // not valid : undefined

    //Validate date, can be null but if exists the format must be "YYYY/MM/DD" or "YYYY/MM/DD HH:MM"
    test_validate_date("2022/04/22", true); // valid
    test_validate_date("2022/04/22 17:07", true); // valid
    test_validate_date("2022/25/266", false); // not valid : month 25 and day 266 do not exist
    test_validate_date("2022/04/22 42:04", false); // vnot valid : hour 42:04 of the day does not exist
    test_validate_date("7", false); // not valid : 7 is not a date
    test_validate_date(undefined, true); // valid : null or undefined is accepted
    test_validate_date(null, true); // valid : null or undefined is accepted
    test_validate_date("abc", false); // not valid

    test_validate_string_value("string", true); // valid 
    test_validate_string_value(15, false); // not valid : a number
    test_validate_string_value(undefined, false); // not valid : undefined

    test_validate_available_value(0, true); // valid : must be 0 or 1
    test_validate_available_value(1, true); // valid : must be 0 or 1
    test_validate_available_value(-12, false); // not valid : a negative number
    test_validate_available_value("abc", false); // not valid : a string
    test_validate_available_value(undefined, false); // not valid : undefined

    test_validate_params_value(15, 15); // valid : an integer value
    test_validate_params_value("string", NaN); // not valid : a string
    test_validate_params_value(undefined, NaN); // not valid : undefined

    test_validate_user_type("supplier", true); // valid : correct type of user
    test_validate_user_type("customer", true); // valid : correct type of user
    test_validate_user_type("qualityEmployee", true); // valid : correct type of user
    test_validate_user_type("clerk", true); // valid : correct type of user
    test_validate_user_type("deliveryEmployee", true); // valid : correct type of user
    test_validate_user_type("string", false); // not valid : a random string
    test_validate_user_type(2, false); // not valid : an integer
    test_validate_user_type(undefined, false); // not valid : undefined 

    validate_password_value("12345678", true); // valid : string with correct length
    validate_password_value("short", false); // not valid : string with length lower than 8
    validate_password_value(undefined, false); // not valid : undefined 

    validate_string_user_value("username", true);
    validate_string_user_value("", false);
    validate_string_user_value(undefined, false);
});

function test_OnlyDigits(input, expectedOutput) {
    test('Test onlyDigits validation utility', async () => {
        var res = validation.onlyDigits(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function test_is_position_valid(input, expectedOutput) {
    test('Test test_is_position_valid validation utility', async () => {
        var res = validation.is_position_valid(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function test_is_position_id_valid(input, expectedOutput) {
    test('Test test_is_position_id_valid validation utility', async () => {
        var res = validation.is_position_id_valid(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function test_is_RFID_valid(input, expectedOutput) {
    test('Test is_RFID_valid validation utility', async () => {
        var res = validation.is_RFID_valid(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function test_validate_number_value(input, expectedOutput) {
    test('Test test_validate_number_value validation utility', async () => {
        var res = validation.validate_number_value(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function test_validate_integer_value(input, expectedOutput) {
    test('Test test_validate_integer_value validation utility', async () => {
        var res = validation.validate_integer_value(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function test_validate_date(input, expectedOutput) {
    test('Test test_validate_date validation utility', async () => {
        var res = validation.validate_date(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}


function test_validate_string_value(input, expectedOutput) {
    test('Test test_validate_string_value validation utility', async () => {
        var res = validation.validate_string_value(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function test_validate_available_value(input, expectedOutput) {
    test('Test test_validate_available_value validation utility', async () => {
        var res = validation.validate_available_value(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function test_validate_params_value(input, expectedOutput) {
    test('Test test_validate_params_value validation utility', async () => {
        var res = validation.validate_params_value(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function test_validate_user_type(input, expectedOutput) {
    test('Test test_validate_user_type validation utility', async () => {
        var res = validation.validate_user_type(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function validate_password_value(input, expectedOutput) {
    test('Test validate_password_value validation utility', async () => {
        var res = validation.validate_password_value(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}

function validate_string_user_value(input, expectedOutput) {
    test('Test validate_string_user_value validation utility', async () => {
        var res = validation.validate_string_user_value(input);
        expect(res).toStrictEqual(expectedOutput);
    });
}