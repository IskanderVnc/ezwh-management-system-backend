'use strict'

const dayjs = require('dayjs');

class Internal_order {

	constructor(id, issueDate, customerId, state = 'ISSUED', products = []) {
		this.id = id;
		this.issueDate = dayjs(issueDate).format('YYYY/MM/DD HH:mm');
		this.state = state;
		this.products = products;
		this.customerId = customerId;
	};


	addProducts(prods) {
		if (prods === undefined) return;

		for (let i = 0; i < prods.length; i++)
			this.products.push(prods[i]);
	}
	setState(newstate) {
		this.state = newstate;
	}
}

module.exports = Internal_order;