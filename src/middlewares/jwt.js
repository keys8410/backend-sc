const { verifyJwt, getTokenFromHeaders } = require('../helpers/jwt');
const SECTOR_CONFIG = require('../config/sector');

const checkJwt = (req, res, next) => {
  // /auth/sign-in; /auth/sign-up >> rotas a serem excluidas da verificação
  const { url: path } = req;

  const excludedPaths = ['/auth/sign-in', '/auth/sign-up', '/auth/refresh'];

  const isExcluded = !!excludedPaths.find((p) => p.startsWith(path));
  if (isExcluded) return next();

  const token = getTokenFromHeaders(req.headers);

  if (!token) return res.jsonUnauthorized(null, 'Invalid token - token');

  try {
    const decoded = verifyJwt(token);
    req.accountId = decoded.id;

    next();
  } catch (error) {
    return res.jsonUnauthorized(null, 'Invalid token - catch');
  }
};

const checkAuthCoord = async (req, res, next) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) return res.jsonUnauthorized(null, 'Invalid token - token');

  try {
    const decoded = verifyJwt(token);

    if (SECTOR_CONFIG.coord !== decoded.sector)
      return res.jsonUnauthorized(null, 'Invalid token - sector');

    next();
  } catch (error) {
    return res.jsonUnauthorized(null, 'Invalid token - expired');
  }
};

module.exports = { checkAuthCoord };
