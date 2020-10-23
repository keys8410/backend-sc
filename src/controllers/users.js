const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('../config/mysql');

const SALTS = 10;

const { getMessages } = require('../helpers/messages');
const { generateUsername, generatePassword } = require('../helpers/generate');
const { validateNewUser, validatePutUser } = require('../validators/users');

const checkId = require('../middlewares/checkId');
const { sendAccessUser } = require('../mailer');
const { checkAuthCoord } = require('../middlewares/jwt');

/**
 *  @api {get} /users 👥 All users
 *  @apiVersion 0.1.0
 *  @apiName List
 *  @apiGroup Users
 *  @apiDescription Retorna todos os funcionários
 *  @apiPermission {Coord}
 *
 *  @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
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
 *  @apiUse UserNotFoundError
 *  @apiUse UnauthorizedJwtExpired
 *  @apiUse UnauthorizedSector
 *  @apiUse UnauthorizedToken
 */
router.get('/', checkAuthCoord, async (req, res) => {
  const query = ` SELECT
                      USER.id_user AS id,
                      USER.name,
                      USER.about,
                      SECTOR.sector
                  FROM
                      tb_users USER
                  INNER JOIN tb_sector SECTOR ON
                      USER.sector = SECTOR.id_sector
                  WHERE USER.state = 1
                  ORDER BY
                      USER.id_user ASC`;

  try {
    const result = await mysql.execute(query);
    if (result.length === 0) return res.jsonNotFound();

    const response = {
      total: result.length,
      users: result.map((user) => user),
    };

    return res.jsonOK(response);
  } catch (error) {
    return res.status(404).jsonBadRequest(null, { error });
  }
});

/**
 *  @api {get} /users/id_user 👤 Unique user
 *  @apiVersion 0.1.0
 *  @apiName List One
 *  @apiGroup Users
 *  @apiDescription Retorna um funcionário específico
 *  @apiPermission {Coord}
 *
 *  @apiParam {Number} id funcionário.
 *
 *  @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
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
 *  @apiUse UserNotFoundError
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
                      SECTOR.sector,
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
    const result = await mysql.execute(query, [id_user]);
    if (result.length === 0) return res.jsonNotFound();

    const response = { user: result.map((user) => user) };

    return res.jsonOK(response);
  } catch (error) {
    return res.jsonBadRequest(null, { error });
  }
});

/**
 *  @api {post} /users 👤 New user 
 *  @apiVersion 0.1.0
 *  @apiName Create user 
 *  @apiGroup Users
 *  @apiDescription Cria um novo funcionário
 *  @apiPermission {Coord}
 * 
 *  @apiParam {string} name                Nome do funcionário.
 *  @apiParam {number} Sector               Setor do funcionário (definirá as permissões dentro da aplicação).
 *  @apiParam {string} Email              E-mail do(s) funcionário(s).
 *  @apiParam {string} CPF                 CPF (único por funcionário).
 *  @apiParam {number} Gender                Sexo do funcionário.
 *  @apiParam {string} Phone             Telefone de contato dos funcionários.
 *  
 *  @apiParamExample {json} Formato de requisição válido
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
 *  @apiParamExample {json} Formato de requisição inválido
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
 *  @apiSuccessExample {json} Válido
HTTP/1.1 200 OK
{
  "message": "Cadastro efetuado com sucesso.",
  "data": null,
  "metadata": {},
  "status": 200
}
 *
 *
 *  @apiSuccessExample {json} Inválido
HTTP/1.1 400 OK
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
router.post('/', checkAuthCoord, validateNewUser, async (req, res) => {
  const { cpf, email, name, phone, sector, gender } = req.body;

  const login = generateUsername(name);
  const pass = generatePassword();

  const queryEmail = ` SELECT 
                          * 
                      FROM 
                          tb_users 
                      WHERE email = ? 
                      AND state = 1`;
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
    const resultEmail = await mysql.execute(queryEmail, [email]);
    if (resultEmail.length > 0) return res.jsonConflict(null);

    bcrypt.hash(pass, SALTS, async (error, hashPass) => {
      if (error) res.jsonBadRequest(error);

      const { insertId } = await mysql.execute(queryLogin, [login, hashPass]);

      await mysql.execute(queryNewUser, [
        insertId,
        cpf,
        email,
        name,
        phone,
        sector,
        gender,
      ]);
    });

    sendAccessUser(email, { name, login, pass });

    return res.jsonOK(null, getMessages('users.post.success'));
  } catch (error) {
    return res.jsonBadRequest(null, { error });
  }
});

/**
 *  @api {put} /users 👤 Edit user
 *  @apiVersion 0.1.0
 *  @apiName Edit user 
 *  @apiGroup Users
 *  @apiDescription Altera os dados de um funcionário
 *  @apiPermission {Coord}
 *
 * 
 *  @apiParam {number} Sector               Setor do funcionário (definirá as permissões dentro da aplicação).
 *  @apiParam {string} Email              E-mail do(s) funcionário(s).
 *  @apiParam {number} Gender                Sexo do funcionário.
 *  @apiParam {string} Phone             Telefone de contato dos funcionários.
 *  
 *  @apiParamExample {json} Formato de requisição válido
{
  "email": "yanalmeidagarcia@gmail.com",
  "phone": "(61) 14444-4444",
  "sector": 2,
  "gender": 1
}

 *
 *
 *  @apiParamExample {json} Formato de requisição inválido
{
  "email": "yanalmeidagarciagmail",
  "phone": "(61) 14444-4",
  "sector": "a",
  "gender": "b"
}
 *
 *
 *  @apiSuccessExample {json} Válido
HTTP/1.1 200 OK
{
  "message": "Dados alterados com sucesso.",
  "data": null,
  "metadata": {},
  "status": 200
}
 *
 *
 *  @apiSuccessExample {json} Inválido
HTTP/1.1 400 OK
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
 *
 *  @apiUse DataConflict
 *  @apiUse UnauthorizedJwtExpired
 *  @apiUse UnauthorizedSector
 *  @apiUse UnauthorizedToken
 */
router.put(
  '/:id_user',
  checkAuthCoord,
  checkId,
  validatePutUser,
  async (req, res) => {
    const { id_user } = req.params;
    const { email, phone, sector, gender } = req.body;

    const query = ` UPDATE
                      tb_users
                  SET
                      email = ?,
                      phone = ?,
                      sector = ?,
                      gender = ?
                  WHERE
                      id_user = ?
                  AND state = 1`;
    const queryEmail = `  SELECT 
                              * 
                          FROM 
                              tb_users 
                          WHERE email = ? 
                          AND state = 1`;

    try {
      const resultEmail = await mysql.execute(queryEmail, [email]);
      if (resultEmail.length > 0) return res.jsonConflict(null);

      await mysql.execute(query, [email, phone, sector, gender, id_user]);

      return res.jsonOK(null, getMessages('users.put.success'));
    } catch (error) {
      return res.jsonBadRequest(null, { error });
    }
  },
);

router.delete('/:id_user', checkAuthCoord, checkId, async (req, res) => {
  const { id_user } = req.body;

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

    return res.jsonOK(null, 'Deletado com sucesso.');
  } catch (error) {
    return res.jsonBadRequest(null, { error });
  }

  /**
   * documentar o metodo DELETE
   */
});

module.exports = router;
