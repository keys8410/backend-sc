require('dotenv').config();
const jwt = require('jsonwebtoken');

const tokenPrivateKey = process.env.JWT_KEY;

const options = { expiresIn: '30 minutes' };

const generateJwt = (payload) => {
  return jwt.sign(payload, tokenPrivateKey, options);
};

const verifyJwt = (token) => {
  return jwt.verify(token, tokenPrivateKey);
};

const getTokenFromHeaders = (headers) => {
  const token = headers['authorization'];

  return token ? token.slice(7, token.length) : null;
};

module.exports = {
  verifyJwt,
  generateJwt,
  getTokenFromHeaders,
};
