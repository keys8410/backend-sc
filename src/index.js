const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const response = require('./middlewares/response');
const controllerUser = require('./controllers/users');
const controllerAuth = require('./controllers/auth');

const app = express();

app.use(response);
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false })); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

app.use('/v1/users', controllerUser);
app.use('/v1/auth', controllerAuth);

module.exports = app;
