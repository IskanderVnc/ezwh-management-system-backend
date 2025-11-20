'use strict';

class RestockOrderService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }

    createRestockOrder = async (restockorder) => {
        const res = await this.dao.createRestockOrder(restockorder);
        return res;
    };

    updateRestockOrderState = async (order, id) => {
        const res = await this.dao.updateRestockOrderState(order, id);
        return res;
    };

    updateRestockOrderTransportNote = async (order, id) => {
        const res = await this.dao.updateRestockOrderTransportNote(order, id);
        return res;
    };

    getRestockOrderList = async () => {
        const res = await this.dao.getRestockOrderList();
        return res;
    };

    getRestockOrderbyId = async (id) => {
        const res = await this.dao.getRestockOrderbyId(id);
        return res;
    };

    getSkuItemstoOrder = async (id) => {
        const res = await this.dao.getSkuItemstoOrder(id);
        return res;
    };

    getSkuItemstoOrder = async (id) => {
        const res = await this.dao.getSkuItemstoOrder(id);
        return res;
    };

    getSkuItemstoReturn = async (id) => {
        const res = await this.dao.getSkuItemstoReturn(id);
        return res;
    };

    addProductToSKURestockTable = async (prod, restockID) => {
        const res = await this.dao.addProductToSKURestockTable(prod, restockID);
        return res;
    };

    addSkuItemsToSkuItemToRestock = async (skuitem, restockID) => {
        const res = await this.dao.addSkuItemsToSkuItemToRestock(skuitem, restockID);
        return res;
    };

    deleteRestockOrderById = async (id) => {
        const res = await this.dao.deleteRestockOrderById(id);
        return res;
    };

    deleteRestockOrderData = async () => {
        const res = await this.dao.deleteRestockOrderData();
        return res;
    };

    deleteSKUItemToRestockData = async () => {
        const res = await this.dao.deleteSKUItemToRestockData();
        return res;
    }

    deleteSKUToRestockData = async () => {
        const res = await this.dao.deleteSKUToRestockData();
        return res;
    }

    addProductstoOrder = async (id) => {
        const res = await this.dao.addProductstoOrder(id);
        return res;
    };
}

module.exports = RestockOrderService;