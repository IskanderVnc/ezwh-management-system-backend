'use strict';

class InternalOrderService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }

    createInternalOrder = async (internalorder) => {
        const res = await this.dao.createInternalOrder(internalorder);
        return res;
    };

    updateInternalOrderState = async (state, id) => {
        const res = await this.dao.updateInternalOrderState(state, id);
        return res;
    };

    deleteInternalOrderById = async (id) => {
        const res = await this.dao.deleteInternalOrderById(id);
        return res;
    };

    deleteInternalOrderData = async () => {
        const res = await this.dao.deleteInternalOrderData();
        return res;
    };

    getInternalOrderList = async () => {
        const list = await this.dao.getInternalOrderList();
        return list;
    };

    getInternalOrderbyID = async (id) => {
        const res = await this.dao.getInternalOrderbyID(id);
        return res;
    };
    getsingleProductsCompletedtoInternalOrder = async (SkuID, rfid, internalorderID) => {
        const res = await this.dao.getsingleProductsCompletedtoInternalOrder(SkuID, rfid, internalorderID);
        return res;
    };
    getProductsIssuedtoInternalOrder = async (id) => {
        const res = await this.dao.getProductsIssuedtoInternalOrder(id);
        return res;
    };

    getProductsCompletedtoInternalOrder = async (id) => {
        const res = await this.dao.getProductsCompletedtoInternalOrder(id);
        return res;
    };

    deleteSkuToInternalItem = async (skuid, id) => {
        const res = await this.dao.deleteSkuToInternalItem(skuid, id);
        return res;
    };

    createSkuItemToInternal = async (item, id) => {
        const res = await this.dao.createSkuItemToInternal(item, id);
        return res;
    };

    addSkuItemToSkuInternalTable = async (prod, id) => {
        const res = await this.dao.addSkuItemToSkuInternalTable(prod, id);
        return res;
    };
    deleteSkuToInternalData = async () => {
        const res = await this.dao.deleteSkuToInternalData();
        return res;
    };
    deleteSkuItemToInternalData = async () => {
        const res = await this.dao.deleteSkuItemToInternalData();
        return res;
    };
    getPrice = async (id, skuid) => {
        const price = await this.dao.getPrice(id, skuid);
        return price;
    }
    getDescription = async (id, skuid) => {
        const description = await this.dao.getDescription(id, skuid);
        return description;
    };

}

module.exports = InternalOrderService;