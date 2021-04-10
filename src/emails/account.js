const sgMail = require('@sendgrid/mail');

const sendgridAPIKey =
  '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';

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'taskmanagerkk@gmail.com',
    subject: 'Welcome to the Task Manager App!',
    text: `Welcome to the Task Manager, ${name}! Thank you for registration! We hope you'll like our application and it'll be very useful for you!/nWith best wishes, Task Manager team!`,
  });
};

const sendCancelationEmil = (email, name) => {
  sgMail.send({
    to: email,
    from: 'taskmanagerkk@gmail.com',
    subject: 'Cancelation from Task Manager',
    text: `Dear ${name}! Your canselation have done successfuly. Please tell us why you did it. We hope to see you later!`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmil,
};
