'use strict'

class Sku {

	constructor(id, description, weight, volume, notes, availableQuantity, price, position = undefined, testDescriptors = []) {
		this.id = id;
		this.description = description;
		this.weight = weight;
		this.volume = volume;
		this.notes = notes;
		this.position = position;
		this.availableQuantity = availableQuantity;
		this.price = price;
		this.testDescriptors = testDescriptors;
	};

	mapSku() {
		return {
			description: this.description, weight: this.weight, volume: this.volume, notes: this.notes, availableQuantity: this.availableQuantity,
			price: this.price, position: this.position, testDescriptors: this.testDescriptors
		};
	}

}

module.exports = Sku;