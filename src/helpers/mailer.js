const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../config/smtp');
const bodyMail = require('./bodyMail');

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

const runMailer = async (name, email, login, pass) => {
  try {
    await transporter.sendMail({
      html: bodyMail(name, login, pass),
      subject: 'Central de Suporte - Projeção',
      from: `Central de Suporte <${SMTP_CONFIG.user}`,
      to: email,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = runMailer;
