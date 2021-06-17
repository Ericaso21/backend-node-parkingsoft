import axios from "axios";

import { Request, Response } from "express";

var config = require("../config");

const RecaptchaMiddelware = (req: Request, res: Response, next: any) => {
  if (process.env.NODE_ENV === 'test') {
    next();
  } else {
    var token: any;
    if (req.body.token === undefined || req.body.token === null) {
      token = req.headers["x-token"];
    } else {
      token = req.body.token;
    }
  
    let urlencodedData = `secret=${config.RECAPTCHAKEY}&response=${token}`;
    axios
      .post("https://www.google.com/recaptcha/api/siteverify", urlencodedData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res: any) => {
        if (res.data.success) {
          next();
        } else {
          res.status(401).send({ message: "No bots!" });
        }
      })
      .catch((err: any) => {
        console.log(err);
        res.status(401).send({ message: "No bots!" });
      });
  }
};

export default RecaptchaMiddelware;
