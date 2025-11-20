'use strict'

class User {

	constructor(id, name, surname, email, password, type) {
		this.id = id;
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.password = password;
		this.type = type;
	};

	mapUser(){
		return { id: this.id, name : this.name, surname : this.surname, email : this.email, type : this.type };
	}
}

module.exports = User;