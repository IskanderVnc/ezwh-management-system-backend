'use strict';


class TestDescriptorService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }

    getTestDescriptorsList = async () => {
        const list = await this.dao.getTestDescriptorsList();
        return list;
    };

    getTestDescriptorById = async (id) => {
        const TD = await this.dao.getTestDescriptorById(id);
        return TD;
    };
    getTestDescriptorsListBySKUId = async (idSKU) => {
        const list = await this.dao.getTestDescriptorsListBySKUId(idSKU);
        return list;
    };
    deleteTestDescriptorData = async () => {
        const res = await this.dao.deleteTestDescriptorData();
        return res;
    };
    updateTestDescriptor = async (testDescriptor, id) => {
        const res = await this.dao.updateTestDescriptor(testDescriptor, id);
        return res;
    };

    createTestDescriptor = async (testDescriptor) => {
        const res = await this.dao.createTestDescriptor(testDescriptor);
        return res;
    };

    deleteTestDescriptor = async (id) => {
        const res = await this.dao.deleteTestDescriptor(id);
        return res;
    };





}

module.exports = TestDescriptorService;