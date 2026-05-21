const nodemailer = require('nodemailer');

console.log("MAILTRAP_USER:", process.env.MAILTRAP_USER);
console.log("MAILTRAP_PASS:", process.env.MAILTRAP_PASS ? "Loaded ✅" : "Missing ❌");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

module.exports = transporter;