'use strict'

const dayjs = require('dayjs');

class Restock_order {

	constructor(id, issueDate, state, supplierId, transportNote = "", products = [], skuItems = []) {
		this.id = id;
		this.issueDate = dayjs(issueDate).format('YYYY/MM/DD HH:mm');
		this.state = state;
		this.products = products;
		this.supplierId = supplierId;
		this.transportNote = transportNote;
		this.skuItems = skuItems;
	};

	addProducts(prods) {
		if (prods === undefined) return;

		for (let i = 0; i < prods.length; i++)
			this.products.push(prods[i]);
	}
	addSkuItems(items) {
		if (items === undefined) return;
		if (this.skuItems.length === 0) {
			for (let i = 0; i < items.length; i++)
				this.skuItems.push(items[i]);
		}
		else {
			this.skuItems.concat(items);
		}
	}

	setState(newstate) {
		this.state = newstate;
	}

	setTransportNote(newnote) {
		this.transportNote = newnote;
	}

	convertTransportNote() {
		if (this.transportNote === "") this.transportNote = undefined;
		if (this.transportNote !== undefined)
			this.transportNote = JSON.parse(this.transportNote);

	}
}

module.exports = Restock_order;