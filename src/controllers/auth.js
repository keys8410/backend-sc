const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('../config/mysql');
const shortUrl = require('node-url-shortener');

const { generatePassword } = require('../helpers/generate');
const { generateJwt, verifyJwt, generateJwtForgot } = require('../helpers/jwt');
const { getMessages } = require('../helpers/messages');
const { sendMail } = require('../mailer');
const size = require('../helpers/size');

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

    const match = user ? bcrypt.compareSync(pass, user.password) : null;

    if (!match)
      return res.jsonBadRequest(null, getMessages('account.signin.invalid'));

    const { sector } = await mysql.execute(querySector, [user.id_user]);

    const token = generateJwt({
      id_user: user.id_user,
      sector,
    });

    return res.jsonOK(
      { id_user: user.id_user, sector },
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
  const { cpf, url } = req.body;

  const queryEmail = `  SELECT 
                            * 
                        FROM 
                            tb_users 
                        WHERE cpf = ?
                        AND state = 1`;

  try {
    const resultEmail = await mysql.execute(queryEmail, [cpf]);
    const { email, name } = resultEmail;

    if (size(resultEmail)) return res.jsonBadRequest(null);

    const resetToken = generateJwtForgot({ email, cpf });
    const rawUrl = `${url}/?key=${resetToken}`;

    shortUrl.short(rawUrl, (err, url) =>
      sendMail('sendTokenResetPass', email, { name, cpf, url }),
    );

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

    const { id_user, name } = await mysql.execute(queryCpf, [cpf]);

    const newPass = generatePassword();
    bcrypt.hash(newPass, SALTS, async (error, hashPass) => {
      if (error) res.jsonBadRequest(error);

      await mysql.execute(queryResetPass, [hashPass, id_user]);
    });

    const { login } = await mysql.execute(queryLogin, [id_user]);

    sendMail('sendNewPassword', decoded.email, { name, login, newPass });

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
