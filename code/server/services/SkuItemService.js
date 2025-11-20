'use strict';


class SkuItemService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }

    deleteSKUItemData = async () => {
        const res = await this.dao.deleteSKUItemData();
        return res;
    };

    createSkuItem = async (skuitem) => {
        const res = await this.dao.createSkuItem(skuitem);
        return res;
    };

    getSkuItemList = async () => {
        const list = await this.dao.getSkuItemList();
        return list;
    };

    getSkuItemListBySkuID = async (id) => {
        const list = await this.dao.getSkuItemListBySkuID(id);
        return list;
    };

    getSkuItemByRFID = async (rfid) => {
        const skuitem = await this.dao.getSkuItemByRFID(rfid);
        return skuitem;
    };

    deleteSkuItemByRFID = async (rfid) => {
        const res = await this.dao.deleteSkuItemByRFID(rfid);
        return res;
    };

    updateSkuItem = async (skuitem, rfid) => {
        const res = await this.dao.updateSkuItem(skuitem, rfid);
        return res;
    };

}

module.exports = SkuItemService;