const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('../config/mysql');
const { getMessages } = require('../helpers/messages');
const { generateUsername, generatePassword } = require('../helpers/generate');
const { validateNewUser } = require('../validators/users');

const SALTS = 10;

router.get('/', async (req, res) => {
  const query = ` SELECT
                      USER.id_usuario AS id,
                      USER.nome_usuario AS name,
                      USER.sobre_usuario AS about,
                      setor.nome_setor AS sector
                  FROM
                      tb_usuario USER
                  INNER JOIN tb_setor setor ON
                      USER.setor_usuario = setor.id_setor
                  ORDER BY
                      USER.nome_usuario ASC`;

  try {
    const result = await mysql.execute(query);

    const response = {
      total: result.length,
      users: result.map((user) => user),
    };

    if (result.length !== 0) return res.jsonOK(response);

    return res.jsonNotFound();
  } catch (error) {
    return res.send(error);
  }
});

router.get('/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  const query = ` SELECT
                      USER.id_usuario AS id,
                      USER.nome_usuario AS name,
                      USER.email_usuario AS email,
                      USER.cpf_usuario AS cpf,
                      USER.tel_usuario AS phone,
                      SETOR.nome_setor AS sector,
                      SEXO.nome_sexo AS gender
                  FROM
                      tb_usuario USER
                  INNER JOIN tb_setor SETOR ON
                      USER.setor_usuario = SETOR.id_setor
                  INNER JOIN tb_sexo SEXO ON
                      USER.sexo_usuario = SEXO.id_sexo
                  WHERE
                      id_usuario = 1
                  LIMIT 1`;

  try {
    const result = await mysql.execute(query, [id_usuario]);

    const response = { user: result.map((user) => user) };

    if (result.length !== 0) return res.jsonOK(response);

    return res.jsonNotFound();
  } catch (error) {
    return res.status(404).send(error);
  }
});

router.post('/', validateNewUser, async (req, res) => {
  const {
    cpf_usuario,
    email_usuario,
    nome_usuario,
    tel_usuario,
    setor_usuario,
    sexo_usuario,
  } = req.body;

  const login = generateUsername(nome_usuario);
  const pass = generatePassword();

  const queryEmail = 'SELECT * FROM tb_usuario WHERE email_usuario = ?';
  const queryLogin = `INSERT INTO tb_dados_login(
                      usuario_login,
                      usuario_senha
                  )
                  VALUES(?, ?)`;
  const queryNewUser = `INSERT INTO tb_usuario(
                            id_usuario,
                            cpf_usuario,
                            email_usuario,
                            nome_usuario,
                            tel_usuario,
                            setor_usuario,
                            sexo_usuario,
                            sobre_usuario,
                            status_usuario
                        )
                        VALUES(?, ?, ?, ?, ?, ?, ?, NULL, '2')`;

  try {
    const resultEmail = await mysql.execute(queryEmail, [email_usuario]);
    if (resultEmail.length > 0) return res.jsonConflict();

    bcrypt.hash(pass, SALTS, async (error, hashPass) => {
      if (error) res.jsonBadRequest(error);

      const { insertId } = await mysql.execute(queryLogin, [login, hashPass]);

      await mysql.execute(queryNewUser, [
        insertId,
        cpf_usuario,
        email_usuario,
        nome_usuario,
        tel_usuario,
        setor_usuario,
        sexo_usuario,
      ]);

      return res.jsonOK(null, getMessages('account.signup.success'));
    });

    /**
     * procurar uma lib para envio de emails: nodemailer
     */
  } catch (error) {
    return res.send(error);
  }
});

router.patch('/');

router.delete('/');

module.exports = router;
