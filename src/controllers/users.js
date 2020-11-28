const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('../config/mysql');

const SALTS = 10;

const { getMessages } = require('../helpers/messages');
const { generateUsername, generatePassword } = require('../helpers/generate');
const { validateUser, validateData } = require('../validators/users');

const checkId = require('../middlewares/checkId');
const { sendMail } = require('../mailer');
const { checkAuthCoord } = require('../middlewares/jwt');
const { verifySize } = require('../helpers/helpers');
const { getTokenFromHeaders, verifyJwt } = require('../helpers/jwt');

/**
 * get all, mudar
 */

/**
 *  @api {get} /users 👥 All users
 *  @apiVersion 0.1.0
 *  @apiName List
 *  @apiGroup Users
 *  @apiDescription Retorna todos os funcionários
 *  @apiPermission Coord
 *
 *  @apiUse BearerToken
 *  @apiUse ContentType
 *
 *  @apiSuccessExample {json} Success
 *    HTTP/1.1 (200) OK
 *    {
 *      "message": "Requisição efetuada com sucesso.",
 *      "data": {
 *        "total": n,
 *        "users": [
 *          {
 *            "id": 1,
 *            "name": "Yan Almeida Garcia",
 *            "about": "Apenas um teste!",
 *            "sector": "Direção"
 *          },
 *            ...
 *        ]
 *      },
 *      "metadata": {},
 *      "status": 200
 *    }
 *
 *  @apiUse NotFound
 *  @apiUse UnauthorizedJwtExpired
 *  @apiUse UnauthorizedSector
 *  @apiUse UnauthorizedToken
 */
router.get('/', checkAuthCoord, async (req, res) => {
  const query = ` SELECT
                      USER.id_user AS id,
                      USER.name,
                      USER.about,
                      SECTOR.sector,
                      USER.state
                  FROM
                      tb_users USER
                  INNER JOIN tb_sector SECTOR ON
                      USER.sector = SECTOR.id_sector
                  WHERE USER.state = 1
                  AND
                      USER.id_user <> ?
                  ORDER BY
                      USER.name 
                  ASC`;

  const token = getTokenFromHeaders(req.headers);
  if (!token)
    return res.jsonUnauthorized(null, getMessages('auth.invalid.token'));

  try {
    const decoded = verifyJwt(token);

    const result = await mysql.execute(query, [decoded.id_user]);
    if (verifySize(result))
      return res.jsonNotFound(null, getMessages('users.get.error'));

    const response = {
      total: result.length,
      users: Array.isArray(result) ? result : [result],
    };

    return res.jsonOK(response);
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(null);
  }
});

/**
 *  @api {get} /users/:id_user 👤 Unique user
 *  @apiVersion 0.1.0
 *  @apiName List One
 *  @apiGroup Users
 *  @apiDescription Retorna um funcionário específico
 *  @apiPermission Coord
 *
 *  @apiUse BearerToken
 *  @apiUse ContentType
 *
 *  @apiParam {Number} id funcionário.
 *
 *  @apiSuccessExample {json} Success
 *   HTTP/1.1 (200) OK
 *   {
 *     "message": "Requisição efetuada com sucesso.",
 *     "data": {
 *      "user": [
 *        {
 *          "id": 1,
 *          "name": "Yan Almeida Garcia",
 *          "email": "yan@almeida.com",
 *          "cpf": "000.000.000-00",
 *          "phone": "(00) 91234-5678",
 *          "sector": "Direção"
 *          "gender": "Não informar"
 *        },
 *      ]
 *    },
 *    "metadata": {},
 *    "status": 200
 *   }
 *  @apiUse NotFound
 *  @apiUse UnauthorizedJwtExpired
 *  @apiUse UnauthorizedSector
 *  @apiUse UnauthorizedToken
 */
router.get('/:id_user', checkAuthCoord, checkId, async (req, res) => {
  const { id_user } = req.params;

  const query = ` SELECT
                      USER.id_user AS id,
                      USER.name,
                      USER.email,
                      USER.cpf,
                      USER.phone,
                      USER.sector as idSector, 
                      SECTOR.sector,
                      USER.gender as idGender,
                      GENDER.gender
                  FROM
                      tb_users USER
                  INNER JOIN tb_sector SECTOR ON
                      USER.sector = SECTOR.id_sector
                  INNER JOIN tb_gender GENDER ON
                      USER.gender = GENDER.id_gender
                  WHERE
                      id_user = ?
                  LIMIT 1`;

  try {
    const user = await mysql.execute(query, [id_user]);
    if (verifySize(user))
      return res.jsonNotFound(null, getMessages('users.get.error'));

    return res.jsonOK({ user });
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(null);
  }
});

/**
 *  @api {post} /users 👤 New user 
 *  @apiVersion 0.1.0
 *  @apiName Create user 
 *  @apiGroup Users
 *  @apiDescription Cria um novo funcionário
 *  @apiPermission Coord
 * 
 *  @apiUse BearerToken 
 *  @apiUse ContentType
 * 
 *  @apiParam (Body) {string} Cpf              CPF do funcionário.
 *  @apiParam (Body) {string} Email              E-mail do funcionário.
 *  @apiParam (Body) {string} Name              Nome do funcionário.      
 *  @apiParam (Body) {number} Sector               Setor do funcionário (definirá as permissões dentro da aplicação).
 *  @apiParam (Body) {number} Gender                Sexo do funcionário.
 *  @apiParam (Body) {string} Phone             Telefone de contato dos funcionário.
 *  
 *  @apiExample {json} Req válida
{
  "cpf": "000.000.251-55",
  "email": "yanalmeidagarcia@gmail.com",
  "name": "Yan Almeida Garcia",
  "phone": "(61) 14444-4",
  "sector": 2,
  "gender": 1
}
 *
 *
 *  @apiParamExample {json} Req inválida
{
  "cpf": "",
  "email": "yanalmeidagarciagmail",
  "name": "12314",
  "phone": "(61) 14444-4",
  "sector": "a",
  "gender": "b"
}
*
*
*  @apiSuccessExample {json} Res válida
HTTP/1.1 (200) OK
{
  "message": "Cadastro efetuado com sucesso.",
  "data": null,
  "metadata": {},
  "status": 200
}
 *
 *
 *  @apiSuccessExample {json} Res inválida
HTTP/1.1 (400) Bad Request
{
  "message": "Requisição inválida.",
  "data": null,
  "metadata": {
    "error": {
      "cpf": "CPF obrigatório.",
      "email": "Email não é válido.",
      "name": "Nome não é válido.",
      "phone": "Telefone não é válido.",
      "sector": "Setor não é válido.",
      "gender": "Sexo não é válido."
    }
  },
  "status": 400
}
 * 
 *
 *  @apiUse DataConflict
 *  @apiUse UnauthorizedJwtExpired
 *  @apiUse UnauthorizedSector
 *  @apiUse UnauthorizedToken
 */
router.post(
  '/',
  checkAuthCoord,
  validateUser,
  validateData,
  async (req, res) => {
    const { cpf, email, name, phone, sector, gender } = req.body;

    const login = generateUsername(name);
    const pass = generatePassword();

    const queryLogin = `INSERT INTO tb_login(
                      login,
                      password
                  )
                  VALUES(?, ?)`;
    const queryNewUser = `INSERT INTO tb_users(
                            id_user,
                            cpf,
                            email,
                            name,
                            phone,
                            sector,
                            gender
                        )
                        VALUES(?, ?, ?, ?, ?, ?, ?)`;

    try {
      bcrypt.hash(pass, SALTS, async (error, hashPass) => {
        if (error) return res.jsonBadRequest(error);

        const { insertId } = await mysql.execute(queryLogin, [login, hashPass]);

        const resultNewUser = await mysql.execute(queryNewUser, [
          insertId,
          cpf,
          email,
          name,
          phone,
          Number(sector),
          Number(gender),
        ]);

        if (verifySize(resultNewUser)) return res.jsonBadRequest(null);
        else sendMail('sendAccessUser', email, { name, login, pass });
      });

      return res.jsonOK(null, getMessages('users.post.success'));
    } catch (error) {
      console.log(error);
      return res.jsonBadRequest(null);
    }
  },
);

/**
 *  @api {put} /users/:id_user 👤 Edit user
 *  @apiVersion 0.1.0
 *  @apiName Edit user 
 *  @apiGroup Users
 *  @apiDescription Altera os dados de um funcionário
 *  @apiPermission Coord
 *
 *  @apiUse BearerToken 
 *  @apiUse ContentType  
 *  
 *  @apiParam {Number} id_user      Id funcionário.
 *  @apiParam (Body) {number} Sector               Setor do funcionário (definirá as permissões dentro da aplicação).
 *  @apiParam (Body) {string} Email              E-mail do(s) funcionário(s).
 *  @apiParam (Body) {number} Gender                Sexo do funcionário.
 *  @apiParam (Body) {string} Phone             Telefone de contato dos funcionário.
 * 
 * 
 *  @apiExample {json} Req válida
{
  "email": "yanalmeidagarcia@gmail.com",
  "phone": "(61) 14444-4444",
  "sector": 2,
  "gender": 1
}
 *
 *
 *  @apiExample {json} Req inválida
{
  "email": "yanalmeidagarciagmail",
  "phone": "(61) 14444-4",
  "sector": "a",
  "gender": "b"
}
 *
 *  @apiSuccessExample {object} Res válida
HTTP/1.1 (200) OK
{
  "message": "Dados alterados com sucesso.",
  "data": null,
  "metadata": {},
  "status": 200
}
 *
 *
 *  @apiSuccessExample {object} Res inválida
HTTP/1.1 (400) Bad Request
{
  "message": "Requisição inválida.",
  "data": null,
  "metadata": {
    "error": {
      "email": "Email não é válido.",
      "phone": "Telefone não é válido.",
      "sector": "Setor não é válido.",
      "gender": "Sexo não é válido."
    }
  },
  "status": 400
}
 * 
 *  @apiUse NotFound
 *  @apiUse DataConflict
 *  @apiUse UnauthorizedJwtExpired
 *  @apiUse UnauthorizedSector
 *  @apiUse UnauthorizedToken
 */
router.put(
  '/:id_user',
  checkAuthCoord,
  checkId,
  validateUser,
  async (req, res) => {
    const { id_user } = req.params;
    const { name, cpf, email, phone, sector, gender } = req.body;

    const query = ` UPDATE
                        tb_users
                    SET
                        name= ?,
                        cpf = ?,
                        email = ?,
                        phone = ?,
                        sector = ?,
                        gender = ?
                    WHERE
                        id_user = ?
                    AND state = 1`;

    try {
      await mysql.execute(query, [
        name,
        cpf,
        email,
        phone,
        sector,
        gender,
        id_user,
      ]);

      return res.jsonOK(null, getMessages('users.put.success'));
    } catch (error) {
      console.log(error);
      return res.jsonBadRequest(null);
    }
  },
);

/**
 *  @api {delete} /users/:id_user 👤 Delete user
 *  @apiVersion 0.1.0
 *  @apiName Delete user 
 *  @apiGroup Users
 *  @apiDescription Deleta um funcionário
 *  @apiPermission Coord
 *
 *  @apiUse BearerToken 
 *  @apiUse ContentType
 *  
 *  @apiParam {Number} id_user      Id funcionário.
 * 
 *
 *  @apiSuccessExample {json} Res válida
HTTP/1.1 (200) OK
{
  "message": "Dados alterados com sucesso.",
  "data": null,
  "metadata": {},
  "status": 200
}
 *
 *
 *  @apiUse NotFound
 *  @apiUse UnauthorizedJwtExpired
 *  @apiUse UnauthorizedSector
 *  @apiUse UnauthorizedToken
 */
router.delete('/:id_user', checkAuthCoord, checkId, async (req, res) => {
  const { id_user } = req.params;

  const queryLogin = `  UPDATE 
                            tb_login 
                        SET
                            state = 0
                        WHERE id_user = ?`;

  const queryUsers = `  UPDATE 
                            tb_users 
                        SET
                            state = 0
                        WHERE id_user = ?`;

  try {
    await mysql.execute(queryLogin, [id_user]);
    await mysql.execute(queryUsers, [id_user]);

    return res.jsonOK(null, getMessages('users.delete.success'));
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(null);
  }
});

module.exports = router;
