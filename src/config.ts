const dotenv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  RDS_HOSTNAME: process.env.RDS_HOSTNAME || "localhost",
  RDS_USERNAME: process.env.RDS_USERNAME || "root",
  RDS_DATABASE: process.env.RDS_DATABASE || "db_parkingsoft",
  RDS_PASSWORD: process.env.RDS_PASSWORD || "",
  RDS_PORT: process.env.RDS_PORT || 3306,
  RECAPTCHAKEY:
    process.env.RECAPTCHAKEY || "6LfGDGEaAAAAAC7VsfjqVEiroWPOocWbKUO-B4-K",
  SECRETKEYJSWEBTOKEN:
    process.env.SECRETKEYJSWEBTOKEN || "46d3b1b6668ef9f6534a0349e45af02e",
  USEREMAIL: process.env.USEREMAIL || "essolarte1@misena.edu.co",
  USERPASSEMAIL: process.env.USERPASSEMAIL || "lknvsgdjjwofyvbs",
  URIFROTEND:
    process.env.URIFROTEND || "http://localhost:4200/#/reset-password",
};
