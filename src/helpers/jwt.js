require('dotenv').config();
const jwt = require('jsonwebtoken');

const tokenPrivateKey = process.env.JWT_KEY;

const options = { expiresIn: '120 minutes' };

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

const generateJwtForgot = (payload) => {
  const expiresIn = { expiresIn: '15 minutes' };
  return jwt.sign(payload, tokenPrivateKey, expiresIn);
};

module.exports = {
  verifyJwt,
  generateJwt,
  getTokenFromHeaders,
  generateJwtForgot,
};
