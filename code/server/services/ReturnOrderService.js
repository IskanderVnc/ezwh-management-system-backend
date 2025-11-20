'use strict';


class ReturnOrderService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }
    deleteItemsToReturnData = async () => {
        const res = await this.dao.deleteItemsToReturnData();
        return res;
    }

    deleteReturnOrderData = async () => {
        const res = await this.dao.deleteReturnOrderData();
        return res;
    };
    getReturnOrderList = async () => {
        const res = await this.dao.getReturnOrderList();
        return res;
    };

    getReturnOrderbyId = async (id) => {
        const res = await this.dao.getReturnOrderbyId(id);
        return res;
    };
    getProductstoReturnOrder = async (id) => {
        const res = await this.dao.getProductstoReturnOrder(id);
        return res;
    };

    createReturnOrder = async (returnorder) => {
        const res = await this.dao.createReturnOrder(returnorder);
        return res;
    };

    deleteReturnOrderById = async (id) => {
        const res = await this.dao.deleteReturnOrderById(id);
        return res;
    };

    createReturnOrder = async (returnorder) => {
        const res = await this.dao.createReturnOrder(returnorder);
        return res;
    };

    addSkuItemToSkuReturnTable = async (prod, id) => {
        const res = await this.dao.addSkuItemToSkuReturnTable(prod, id);
        return res;
    };

}

module.exports = ReturnOrderService;