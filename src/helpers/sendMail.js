const mailer = require('../mailer');

const sendAccessUser = async (name, email, login, pass) => {
  const body = {
    name,
    login,
    pass,
  };

  const mailInfos = {
    template: 'sendAccessUser',
    context: body,
    subject: 'Central de Suporte - Projeção',
    from: `Central de Suporte <${SMTP_CONFIG.user}`,
    to: email,
  };

  mailer(mailInfos);
};

const sendTokenResetPass = async (email, resetToken) => {
  const body = {
    email,
    resetToken,
  };

  const mailInfos = {
    template: 'sendAccessUser',
    context: body,
    subject: 'Central de Suporte - Projeção',
    from: `Central de Suporte <${SMTP_CONFIG.user}`,
    to: email,
  };

  mailer(mailInfos);
};

module.exports = { sendAccessUser, sendTokenResetPass };
