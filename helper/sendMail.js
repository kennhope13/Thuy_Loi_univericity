const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const sendMail = asyncHandler(async ({ Email, html }) => {
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: "quangtn0607@gmail.com", // generated ethereal user
          pass: "xysz idqs awxa xzbd", // generated ethereal password
      },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
      from: '"school" <no-relply@nhatruong.com>', // sender address
      to: Email, // list of receivers
      subject: "Forgot password", // Subject line
      html: html, // html body
  });

  return info
})


module.exports = {
    sendMail
}