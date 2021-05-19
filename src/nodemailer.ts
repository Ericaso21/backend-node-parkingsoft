import nodemailer from "nodemailer";
var config = require("./config");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.USEREMAIL, // generated ethereal user
    pass: config.USERPASSEMAIL, // generated ethereal password
  },
});

transporter.verify().then(() => {
  console.log("Run send emails");
});
