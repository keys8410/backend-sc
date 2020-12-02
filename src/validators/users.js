const Joi = require('@hapi/joi');
const { getValidatorError } = require('../helpers/validator');
const mysql = require('../config/mysql');

const options = { abortEarly: false };
const rules = {
  cpf: Joi.string()
    .pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/))
    .required(),
  email: Joi.string().email().required(),
  name: Joi.string()
    .pattern(new RegExp(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp(/(\(\d{2}\)\s)(\d{4,5}\-\d{4})/))
    .required(),
  sector: Joi.required(),
  gender: Joi.required(),
};

const validateUser = (req, res, next) => {
  const { cpf, email, name, phone, sector, gender } = req.body;

  const schema = Joi.object({
    cpf: rules.cpf,
    email: rules.email,
    name: rules.name,
    phone: rules.phone,
    sector: rules.sector,
    gender: rules.gender,
  });

  const { error } = schema.validate(
    {
      cpf,
      email,
      name,
      phone,
      sector,
      gender,
    },
    options,
  );

  if (error) {
    const messages = getValidatorError(error, 'users');

    return res.jsonBadRequest(null, null, { error: messages });
  }

  next();
};

const validateData = async (req, res, next) => {
  const { email, cpf } = req.body;

  const queryEmail = `  SELECT 
                          *
                        FROM 
                          tb_users 
                        WHERE email = ? 
                        AND state = 1`;

  const queryCpf = `  SELECT 
                        * 
                      FROM 
                        tb_users 
                      WHERE cpf = ? 
                      AND state = 1`;

  try {
    const resultEmail = await mysql.execute(queryEmail, [email]);
    if (resultEmail.length === 0 ? false : true)
      return res.jsonConflict(null, null, {
        error: { email: 'Email já cadastrado' },
      });

    const resultCpf = await mysql.execute(queryCpf, [cpf]);
    if (resultCpf.length === 0 ? false : true)
      return res.jsonConflict(null, null, {
        error: { cpf: 'CPF já cadastrado' },
      });

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { validateUser, validateData };
