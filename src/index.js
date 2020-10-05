const express = require('express');
const app = express();

const controllerUser = require('./controllers/users');

app.use('/users', controllerUser);

module.exports = app;
