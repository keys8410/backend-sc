const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('../config/mysql');

const SALTS = 10;

const { getMessages } = require('../helpers/messages');
const { generateUsername, generatePassword } = require('../helpers/generate');
const { validateNewUser } = require('../validators/users');

const checkId = require('../middlewares/checkId');
const { sendAccessUser } = require('../mailer');
const { checkAuthCoord } = require('../middlewares/jwt');

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
    if (resultEmail.length > 0) return res.jsonConflict();

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

    return res.jsonOK(null, getMessages('account.signup.success'));
  } catch (error) {
    return res.jsonBadRequest(null, { error });
  }
});

router.put('/', checkAuthCoord, async (req, res) => {
  const { cpf, email, phone, sector, gender } = req.body;

  const query = ` UPDATE
                      tb_users
                  SET
                      email = ?,
                      phone = ?,
                      sector = ?,
                      gender = ?
                  WHERE
                      cpf = ?`;

  try {
    await mysql.execute(query, [email, phone, sector, gender, cpf]);

    return res.jsonOK(null, 'Dados alterados com sucesso.');
  } catch (error) {
    return res.jsonBadRequest(null, { error });
  }
});

router.delete('/', checkAuthCoord, checkId, async (req, res) => {
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
