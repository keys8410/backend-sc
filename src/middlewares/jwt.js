const { verifyJwt, getTokenFromHeaders } = require('../helpers/jwt');
const SECTOR_CONFIG = require('../config/sector');

const { getMessages } = require('../helpers/messages');

const checkAuthMaster = (req, res, next) => {};

const checkAuthCoord = (req, res, next) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token)
    return res.jsonUnauthorized(null, getMessages('auth.invalid.token'));

  try {
    const decoded = verifyJwt(token);

    if (SECTOR_CONFIG.coord !== decoded.sector)
      return res.jsonUnauthorized(null, getMessages('auth.invalid.sector'));

    next();
  } catch (error) {
    console.log(error);
    return res.jsonUnauthorized(
      null,
      getMessages('auth.invalid.expired_token'),
    );
  }
};

const checkAuthTech = (req, res, next) => {};

module.exports = { checkAuthMaster, checkAuthCoord, checkAuthTech };
