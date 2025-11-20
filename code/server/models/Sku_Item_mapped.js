'use strict'

const dayjs = require('dayjs');

class Sku_item_mapped {

	constructor(RFID, SKUId, DateOfStock) {
		this.RFID = RFID;
		this.SKUId = SKUId;
		this.DateOfStock = dayjs(DateOfStock).format('YYYY/MM/DD HH:mm');
	};

}

module.exports = Sku_item_mapped;