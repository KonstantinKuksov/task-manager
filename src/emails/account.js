const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendWelcomeEmail = (email, name) => {
  transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_ADRESS}>`,
    to: email,
    subject: 'Welcome!',
    text: `Welcome to Task Manager, ${name}! Thank you for registration! We hope you'll like our application and it'll be very useful for you.
    With best wishes, Task Manager team!`,
  });
};

const sendCancelationEmil = (email, name) => {
  transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_ADRESS}>`,
    to: email,
    subject: 'Cancelation from Task Manager',
    text: `Dear ${name}! Your canselation have done successfuly. Please tell us why you did it. We hope to see you later!`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmil,
};
