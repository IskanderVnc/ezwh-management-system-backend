'use strict';


class TestResultService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }

    getTestResultListByRFID = async (rfid) => {
        const list = await this.dao.getTestResultListByRFID(rfid);
        return list;
    };

    getTestResultByIdAndRFID = async (id, rfid) => {
        const TR = await this.dao.getTestResultByIdAndRFID(id, rfid);
        return TR;
    };

    getTestResultById = async (id) => {
        const TR = await this.dao.getTestResultById(id);
        return TR;
    };

    deleteTestResult = async (id) => {
        const res = await this.dao.deleteTestResult(id);
        return res;
    };

    deleteTestResultData = async () => {
        const res = await this.dao.deleteTestResultData();
        return res;
    };

    updateTestResult = async (testResult, id) => {
        const res = await this.dao.updateTestResult(testResult, id);
        return res;
    };
    createTestResult = async (testResult, rfid) => {
        const res = await this.dao.createTestResult(testResult, rfid);
        return res;
    };



}

module.exports = TestResultService;