'use strict'

const dayjs = require('dayjs');

class Sku_item {

	constructor(RFID, SKUId, DateOfStock, Available = 0) {
		this.RFID = RFID;
		this.SKUId = SKUId;
		this.Available = Available;
		this.DateOfStock = dayjs(DateOfStock).format('YYYY/MM/DD HH:mm');
	};
	
}

module.exports = Sku_item;