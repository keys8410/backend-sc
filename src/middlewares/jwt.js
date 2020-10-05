const { verifyJwt, getTokenFromHeaders } = require('../helpers/jwt');

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
    console.log(error);
    return res.jsonUnauthorized(null, 'Invalid token - catch');
  }
};

module.exports = checkJwt;
