const { verifyJwt, getTokenFromHeaders } = require('../helpers/jwt');
const SECTOR_CONFIG = require('../config/sector');

const checkAuthMaster = (req, res, next) => {};

const checkAuthCoord = (req, res, next) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) return res.jsonUnauthorized(null, 'Invalid token - token');

  try {
    const decoded = verifyJwt(token);

    if (SECTOR_CONFIG.coord !== decoded.sector)
      return res.jsonUnauthorized(null, 'Invalid token - sector');

    next();
  } catch (error) {
    console.log(error);
    return res.jsonUnauthorized(null, 'Invalid token - jwt expired');
  }
};

const checkAuthTech = (req, res, next) => {};

module.exports = { checkAuthMaster, checkAuthCoord, checkAuthTech };
