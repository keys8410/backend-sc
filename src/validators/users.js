const Joi = require('@hapi/joi');
const { getValidatorError } = require('../helpers/validator');

const options = { abortEarly: false };
const rules = {
  cpf_usuario: Joi.string()
    .pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/))
    .required(),
  email_usuario: Joi.string().email().required(),
  nome_usuario: Joi.string()
    .pattern(new RegExp(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/))
    .required(),
  tel_usuario: Joi.string()
    .pattern(new RegExp(/(\(\d{2}\)\s)(\d{4,5}\-\d{4})/))
    .required(),
  setor_usuario: Joi.number().required(),
  sexo_usuario: Joi.number().required(),
};

const validateNewUser = (req, res, next) => {
  const {
    cpf_usuario,
    email_usuario,
    nome_usuario,
    tel_usuario,
    setor_usuario,
    sexo_usuario,
  } = req.body;

  const schema = Joi.object({
    cpf_usuario: rules.cpf_usuario,
    email_usuario: rules.email_usuario,
    nome_usuario: rules.nome_usuario,
    tel_usuario: rules.tel_usuario,
    setor_usuario: rules.setor_usuario,
    sexo_usuario: rules.sexo_usuario,
  });

  const { error } = schema.validate(
    {
      cpf_usuario,
      email_usuario,
      nome_usuario,
      tel_usuario,
      setor_usuario,
      sexo_usuario,
    },
    options,
  );

  if (error) {
    const messages = getValidatorError(
      error,
      'account.signin.all.any.required',
    );

    return res.jsonBadRequest(null, null, { error: messages });
  }

  next();
};

module.exports = { validateNewUser };
