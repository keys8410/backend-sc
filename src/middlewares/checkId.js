const mysql = require('../config/mysql');

const queryId = 'SELECT * FROM tb_login WHERE id_user = ? AND state = 1';

const checkId = async (req, res, next) => {
  const id_user = req.params.id_user ? req.params.id_user : req.body.id_user;

  console.log(`*** id_user => ${id_user}`);

  const resultId = await mysql.execute(queryId, [id_user]);
  if (resultId.length === 0) return res.jsonNotFound();

  next();
};

module.exports = checkId;