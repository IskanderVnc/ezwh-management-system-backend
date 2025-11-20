'use strict';


class SkuService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }


    getSkuList = async () => {
        const list = await this.dao.getSkuList();
        return list;
    };

    getSkuByID = async (id) => {
        const sku = await this.dao.getSkuByID(id);
        return sku;
    };

    createSku = async (sku) => {
        const res = await this.dao.createSku(sku);
        return res;
    };

    deleteSkuByID = async (id) => {
        const res = await this.dao.deleteSkuByID(id);
        return res;
    };

    deleteSKUData = async () => {
        const res = await this.dao.deleteSKUData();
        return res;
    };

    updateSkuPosition = async (skuID, newPositionID) => {
        const res = await this.dao.updateSkuPosition(skuID, newPositionID);
        return res;
    };

    updateSku = async (sku, id) => {
        const res = await this.dao.updateSku(sku, id);
        return res;
    };



}

module.exports = SkuService;