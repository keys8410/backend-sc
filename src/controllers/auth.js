const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('../config/mysql');

const { generatePassword } = require('../helpers/generate');
const { generateJwt, verifyJwt, generateJwtForgot } = require('../helpers/jwt');
const { getMessages } = require('../helpers/messages');
const { sendTokenResetPass, sendNewPassword } = require('../mailer');

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

    return res.jsonOK(
      { id_user, sector: resultSector[0].sector },
      getMessages('account.signin.success'),
      {
        token,
      },
    );
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(error);
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email, cpf } = req.body;

  const queryEmail = `  SELECT 
                            * 
                        FROM 
                            tb_users 
                        WHERE email = ? 
                        AND cpf = ?
                        AND state = 1`;

  try {
    const resultEmail = await mysql.execute(queryEmail, [email, cpf]);
    if (resultEmail.length === 0) return res.jsonBadRequest();

    const resetToken = generateJwtForgot({ email, cpf });

    sendTokenResetPass(email, resetToken);

    return res.jsonOK();
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(null, { error });
  }
});

router.post('/reset-password', async (req, res) => {
  const { cpf, resetToken } = req.body;

  const queryCpf = `SELECT
                        id_user,
                        name
                    FROM
                        tb_users
                    WHERE
                        cpf = ?
                    AND state = 1`;
  const queryLogin = `SELECT
                          login
                      FROM
                          tb_login
                      WHERE
                          id_user = ?
                      AND state = 1`;
  const queryResetPass = `UPDATE
                              tb_login
                          SET
                              password = ?
                          WHERE
                              id_user = ?`;

  const decoded = verifyJwt(resetToken);
  if (cpf !== decoded.cpf) return res.jsonUnauthorized(null, 'Invalid token');

  try {
    const SALTS = 10;

    const resultCpf = await mysql.execute(queryCpf, [cpf]);
    const { id_user, name } = resultCpf[0];

    const newPass = generatePassword();
    bcrypt.hash(newPass, SALTS, async (error, hashPass) => {
      if (error) res.jsonBadRequest(error);

      await mysql.execute(queryResetPass, [hashPass, id_user]);
    });

    const resultLogin = await mysql.execute(queryLogin, [id_user]);
    const { login } = resultLogin[0];

    sendNewPassword(name, decoded.email, login, newPass);

    return res.jsonOK(
      null,
      `Dados de acesso enviados no email ${decoded.email}`,
    );
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest();
  }
});

module.exports = router;
