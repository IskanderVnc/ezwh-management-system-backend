'use strict'

class User_mapped {

	constructor(id, name, surname, email, type = undefined) {
		this.id = id;
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.type = type;
	};

	mapUser() {
		return { id: this.id, name: this.name, surname: this.surname, email: this.email };
	}
}

module.exports = User_mapped;