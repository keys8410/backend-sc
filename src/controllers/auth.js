const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('../config/mysql');
const shortUrl = require('node-url-shortener');

const { generatePassword } = require('../helpers/generate');
const { generateJwt, verifyJwt, generateJwtForgot } = require('../helpers/jwt');
const { getMessages } = require('../helpers/messages');
const { sendMail } = require('../mailer');
const { verifySize, verifyRegex } = require('../helpers/helpers');

/**
 *  @api {post} /auth/sign-in ⛔ Login user
 *  @apiVersion 0.1.0
 *  @apiName Login user 
 *  @apiGroup Auth
 *  @apiDescription Loga um usuário
 *
 *  @apiUse ContentType
 *   
 *  @apiParam (Body) {string} Login             Login de acesso do usuário.
 *  @apiParam (Body) {string} Pass              Senha de acesso do usuário.
 * 
 * 
 *  @apiExample {json} Req válida
{
  "login": "yan.garcia-203",
  "pass": "ry9hyqbq" 
}
 *
 *
 *  @apiExample {json} Req inválida
{
  "login": "",
  "pass": "ry2tyqsq" 
}
 *
 *  @apiSuccessExample {json} Res válida
HTTP/1.1 (200) OK
{
  "message": "Login efetuado com sucesso.",
  "data": {
    "id_user": 1,
    "sector": 1
  },
  "metadata": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "status": 200
}
 *
 *
 *  @apiSuccessExample {json} Res inválida
HTTP/1.1 (400) Bad Request
{
  "message": "Credenciais inválidas.",
  "data": null,
  "metadata": {},
  "status": 400
}
 *
 */
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
    return res.jsonBadRequest(null, getMessages('account.signin.invalid'));
  }
});

/**
 *  @api {post} /auth/forgot-password ❓ Forgot password
 *  @apiVersion 0.1.0
 *  @apiName Forgot password 
 *  @apiGroup Auth
 *  @apiDescription Envial um email ao funcionário contendo o URL para resetar a senha de acesso
 *
 *  @apiUse ContentType
 *  
 *  @apiParam (Body) {string} CPF              CPF do funcionário.
 *  @apiParam (Body) {string} URL              Endpoint (window.location.href) partindo do front.
 *  
 *  @apiExample {json} Req válida
{
  "cpf": "000.000.000-00",
  "url": "http://localhost:3001/v1/api"
}
 *
 *
 *  @apiExample {json} Req inválida
{
  "cpf": "a0.00.000-00",
  "url": ""
}
 *
 *  @apiSuccessExample {json} Res válida
HTTP/1.1 (200) OK
{
  "message": "Email enviado com sucesso.",
  "data": null,
  "metadata": {},
  "status": 200
}
 *
 *
 *  @apiErrorExample {json} Res inválida - CPF 
HTTP/1.1 (404) Not Found
{
  "message": "CPF não encontrado",
  "data": null,
  "metadata": {},
  "status": 404
}
 *
 *
 * @apiErrorExample {json} Res inválida - URL
HTTP/1.1 (400) Bad Request
{
  "message": "Formato de URL inválido.",
  "data": null,
  "metadata": {},
  "status": 400
}
 *
 *
 */
router.post('/forgot-password', async (req, res) => {
  const { cpf, url } = req.body;

  const queryEmail = `  SELECT 
                            * 
                        FROM 
                            tb_users 
                        WHERE cpf = ?
                        AND state = 1`;

  if (verifyRegex(/( *?https{0,1}:\/\/)/, url))
    return res.jsonBadRequest(null, getMessages('auth.forgot.url_error'));

  try {
    const resultEmail = await mysql.execute(queryEmail, [cpf]);
    const { email, name } = resultEmail;

    if (verifySize(resultEmail))
      return res.jsonNotFound(null, getMessages('auth.forgot.cpf_not_found'));

    const resetToken = generateJwtForgot({ email, cpf });
    const rawUrl = `${url}/?key=${resetToken}`;

    shortUrl.short(rawUrl, (err, url) =>
      sendMail('sendfTokenResetPass', email, { name, cpf, url }),
    );
    /**
     * documentar route /auth/forgot-password
     * finalizar metodos e responses
     * verificar pendencias
     * gravar video
     */
    return res.jsonOK(null, getMessages('auth.forgot.email_success'));
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(null);
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
  if (cpf !== decoded.cpf)
    return res.jsonUnauthorized(null, getMessages('auth.reset.token'));

  try {
    const SALTS = 10;

    const { id_user, name } = await mysql.execute(queryCpf, [cpf]);

    const newPass = generatePassword();
    bcrypt.hash(newPass, SALTS, async (error, hashPass) => {
      if (error) res.jsonBadRequest(error);

      await mysql.execute(queryResetPass, [hashPass, id_user]);
    });

    const { login } = await mysql.execute(queryLogin, [id_user]);

    //  sendMail('sendNewPassword', decoded.email, { name, login, newPass });

    return res.jsonOK(
      null,
      `Dados de acesso enviados no email ${decoded.email}`,
    );
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(null);
  }
});

module.exports = router;
