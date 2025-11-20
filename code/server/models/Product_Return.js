'use strict'


class Product_Return {

	constructor(SKUId,description,price, RFID) {
		this.SKUId = SKUId;
		this.description = description;
		this.price = price;
		this.RFID = RFID;

	};

}

module.exports = Product_Return;