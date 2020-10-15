const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('../config/mysql');
const { generateJwt } = require('../helpers/jwt');
const { getMessages } = require('../helpers/messages');

router.user;

router.post('/sign-in', async (req, res) => {
  const { login, pass } = req.body;

  const query = 'SELECT * FROM tb_login WHERE login = ? AND state = 1';
  const querySector = ` SELECT
                            sector
                        FROM
                            tb_users 
                        WHERE
                            id_user = ?
                        AND state = 1`;

  try {
    const user = await mysql.execute(query, [login]);

    const match =
      user.length !== 0 ? bcrypt.compareSync(pass, user[0].password) : null;

    if (!match)
      return res.jsonBadRequest(null, getMessages('account.signin.invalid'));

    const { id_user } = user[0];
    const resultSector = await mysql.execute(querySector, [id_user]);

    const token = generateJwt({ id_user, sector: resultSector[0].sector });

    return res.jsonOK({ id_user }, getMessages('account.signin.success'), {
      token,
    });
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(error);
  }
});

module.exports = router;
