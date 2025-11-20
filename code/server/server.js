'use strict';
const express = require('express');


//This two lines are used to create the database (and populate it with the hardcoded users) if the file doesn't exist
const Database = require('./database/database');
const createDatabase = new Database('./database/EzWhDB.sqlite');


//Routes of APIs 
const skuAPIs = require('./api/skuAPIs');
const skuItemAPIs = require('./api/skuItemAPIs');
const positionAPIs = require('./api/positionAPIs');
const testDescriptorAPIs = require('./api/testDescriptorAPIs');
const testResultAPIs = require('./api/testResultAPIs');
const restockOrderAPIs = require('./api/restockOrderAPIs');
const returnOrderAPIs = require('./api/returnOrderAPIs');
const internalOrderAPIs = require('./api/internalOrderAPIs');
const itemAPIs = require('./api/itemAPIs');
const userAPIs = require('./api/userAPIs');


// init express
const app = new express();
const port = 3001;

app.use(express.json());
//Routing different files
app.use('/', skuAPIs);
app.use('/', skuItemAPIs);
app.use('/', positionAPIs);
app.use('/', testDescriptorAPIs);
app.use('/', testResultAPIs);
app.use('/', restockOrderAPIs);
app.use('/', returnOrderAPIs);
app.use('/', internalOrderAPIs);
app.use('/', itemAPIs);
app.use('/', userAPIs);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;

