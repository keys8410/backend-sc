const app = require('express')();
const express = require('express');

const cors = require('cors');
const morgan = require('morgan');

const response = require('./middlewares/response');
const controllerUser = require('./controllers/users');
const controllerAuth = require('./controllers/auth');

app.use(response);
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/v1/users', controllerUser);
app.use('/v1/auth', controllerAuth);

module.exports = app;
