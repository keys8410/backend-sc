const Joi = require('@hapi/joi');
const { getValidatorError } = require('../helpers/validator');

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
  sector: Joi.string()
    .pattern(new RegExp(/^\[0-9]/))
    .required(),
  gender: Joi.string()
    .pattern(new RegExp(/^\[0-9]/))
    .required(),
};

const validateNewUser = (req, res, next) => {
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
    const messages = getValidatorError(error, 'users.post');

    return res.jsonBadRequest(null, null, { error: messages });
  }

  next();
};

module.exports = { validateNewUser };
