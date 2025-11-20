'use strict';

class ItemService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }

    deleteItemData = async () => {
        const res = await this.dao.deleteItemData();
        return res;
    };

    getItemList = async () => {
        const list = await this.dao.getItemList();
        return list;
    };

    getItembyId = async (id) => {
        const item = await this.dao.getItembyId(id);
        return item;
    };

    createItem = async (item) => {
        const res = await this.dao.createItem(item);
        return res;
    };

    updateItem = async (item, id) => {
        const res = await this.dao.updateItem(item, id);
        return res;
    };

    deleteItemByID = async (id) => {
        const res = await this.dao.deleteItemByID(id);
        return res;
    };

    getIfSupplierSellItem = async (suppID, skuID) => {
        const res = await this.dao.getIfSupplierSellItem(suppID, skuID);
        return res;
    };

    getIfSupplierSellItem2 = async (suppID, itemID) => {
        const res = await this.dao.getIfSupplierSellItem2(suppID, itemID);
        return res;
    };


}

module.exports = ItemService;