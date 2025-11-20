'use strict'

class Item {

	constructor(id, description, price, SKUId, supplierId) {
		this.id = id;
		this.description = description;
		this.price = price;
		this.SKUId = SKUId;
		this.supplierId = supplierId;
	};

	setDescription(newDes) {
		this.description = newDes;
	}

	setPrice(newPrice) {
		this.price = newPrice;
	}
}

module.exports = Item;