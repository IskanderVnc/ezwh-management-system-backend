'use strict'

const dayjs = require('dayjs');

class Test_result {

	constructor(id, idTestDescriptor, Date, Result) {
		this.id = id;
		this.idTestDescriptor = idTestDescriptor;
		this.Date = dayjs(Date).format('YYYY/MM/DD');
		this.Result = Result;
	};
}

module.exports = Test_result;