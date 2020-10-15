const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

require('dotenv').config();

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
  host: process.env.host,
  port: process.env.port,
  secure: false,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
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

module.exports = { sendAccessUser };
