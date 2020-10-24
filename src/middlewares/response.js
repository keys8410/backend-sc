const { getMessages } = require('../helpers/messages');

const TYPE_JSON = 'application/json';
const STATUS_CODE_OK = 200;
const STATUS_CODE_BAD_RESQUEST = 400;
const STATUS_CODE_UNAUTHORIZED = 401;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_CONFLICT = 409;
const STATUS_CODE_SERVER_ERROR = 500;

const jsonOK = function (data, message, metadata) {
  const status = STATUS_CODE_OK;

  message = message ? message : getMessages('response.json_ok');
  metadata = metadata ? metadata : {};

  this.status(status);
  this.type(TYPE_JSON);

  return this.json({ message, data, metadata, status });
};

const jsonBadRequest = function (data, message, metadata) {
  const status = STATUS_CODE_BAD_RESQUEST;

  message = message ? message : getMessages('response.json_bad_request');
  metadata = metadata ? metadata : {};

  this.status(status);
  this.type(TYPE_JSON);

  return this.json({ message, data, metadata, status });
};

const jsonUnauthorized = function (data, message, metadata) {
  const status = STATUS_CODE_UNAUTHORIZED;

  message = message ? message : getMessages('response.json_unauthorized');
  metadata = metadata ? metadata : {};

  this.status(status);
  this.type(TYPE_JSON);

  return this.json({ message, data, metadata, status });
};

const jsonNotFound = function (data, message, metadata) {
  const status = STATUS_CODE_NOT_FOUND;

  message = message ? message : getMessages('response.json_not_found');
  metadata = metadata ? metadata : {};

  this.status(status);
  this.type(TYPE_JSON);

  return this.json({ message, data, metadata, status });
};

const jsonConflict = function (data, message, metadata) {
  const status = STATUS_CODE_CONFLICT;

  message = message ? message : getMessages('response.json_conflict');
  metadata = metadata ? metadata : {};

  this.status(status);
  this.type(TYPE_JSON);

  return this.json({ message, data, metadata, status });
};

const jsonServerError = function (data, message, metadata) {
  const status = STATUS_CODE_SERVER_ERROR;

  message = message ? message : getMessages('response.json_server_error');
  metadata = metadata ? metadata : {};

  this.status(status);
  this.type(TYPE_JSON);

  return this.json({ message, data, metadata, status });
};

const resp = (req, res, next) => {
  res.jsonOK = jsonOK;
  res.jsonBadRequest = jsonBadRequest;
  res.jsonUnauthorized = jsonUnauthorized;
  res.jsonNotFound = jsonNotFound;
  res.jsonConflict = jsonConflict;
  res.jsonServerError = jsonServerError;

  next();
};

module.exports = resp;
