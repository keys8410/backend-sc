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

const mailer = async (mailInfos) => {
  try {
    await transporter.mailer(mailInfos);
  } catch (error) {
    console.log(error);
  }
};

module.exports = mailer;
