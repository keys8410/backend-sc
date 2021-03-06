const mysql = require('../config/mysql');
const { verifySize } = require('../helpers/helpers');

const queryId = 'SELECT * FROM tb_login WHERE id_user = ? AND state = 1';

const checkId = async (req, res, next) => {
  const id_user = req.params.id_user ? req.params.id_user : req.body.id_user;

  const resultId = await mysql.execute(queryId, [id_user]);
  if (verifySize(resultId)) return res.jsonNotFound(null);

  next();
};

module.exports = checkId;
