const nodeMailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  // get tge path of the email template
  const emailTemplate = path.join(__dirname, `../templates/${template}.ejs`)

  // render the email template using EJS with the data
  const html = await ejs.renderFile(emailTemplate, data);

  const mailOptions = {
    from: `Nelami <nelami@ihamza.dev>`,
    to: email,
    subject: subject,
    html,
  };

  const response = await transporter.sendMail(mailOptions);

  return response;
};

module.exports = sendEmail;
