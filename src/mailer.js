const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const SMTP_CONFIG = require('./config/smtp');

const options = {
  viewEngine: {
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts',
    extname: '.hbs',
  },
  extName: '.hbs',
  viewPath: 'src/views',
};

const transporter = nodemailer.createTransport({
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.port,
  secure: false,
  auth: {
    user: SMTP_CONFIG.user,
    pass: SMTP_CONFIG.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.use('compile', hbs(options));

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

  try {
    await transporter.sendMail(mailInfos);
  } catch (error) {
    console.log(error);
  }
};

const sendTokenResetPass = async (email, resetToken) => {
  const body = {
    email,
    resetToken,
  };

  const mailInfos = {
    template: 'sendTokenResetPass',
    context: body,
    subject: 'Central de Suporte - Projeção',
    from: `Central de Suporte <${SMTP_CONFIG.user}`,
    to: email,
  };

  try {
    await transporter.sendMail(mailInfos);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendAccessUser, sendTokenResetPass };
