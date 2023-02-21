const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. CreateTransporter
  const transporter = nodemailer.createTransport({
    //service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    logger: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //activate in gmail "less secure app" option
  });

  // 2. define the email options
  const mailOptions = {
    from: 'Leonid Zhuravel <L_Z@no.mail>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html: options.email,
  };

  // 3. send an email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
