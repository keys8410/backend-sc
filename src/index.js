const express = require('express');
const app = express();

const response = require('./middlewares/response');
const bodyParser = require('body-parser');

const controllerUser = require('./controllers/users');
const controllerAuth = require('./controllers/auth');

app.use(response);

app.use(bodyParser.urlencoded({ extended: false })); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

app.use('/v1/users', controllerUser);
app.use('/v1/auth', controllerAuth);

module.exports = app;
