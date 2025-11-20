'use strict'

const dayjs = require('dayjs');

class Return_order {

	constructor(id, returnDate, restockOrderId,products=[]) {
		this.id = id;
		this.returnDate = dayjs(returnDate).format('YYYY/MM/DD HH:mm');
		this.products = products;
        this.restockOrderId = restockOrderId;
	};

	addProducts(prods) {
		if(prods===undefined) return;

		for(let i=0;i<prods.length;i++)
		this.products.push(prods[i]);
	}
	
}

module.exports = Return_order;