import { Request, Response } from "express";
import pool from "../database";
import jsonwebtoken from "jsonwebtoken";
var config = require("../config");

class AuthController {
  // create client user database
  public async create(req: Request, res: Response) {
    // delete token recaptcha
    delete req.body.token;
    // validate required fields
    if (
      (req.body.document_number == "" || req.body.pk_fk_id_document_type === 0,
      req.body.fk_id_gender == 0 ||
        req.body.email == "" ||
        req.body.password_user == "")
    ) {
      res
        .status(404)
        .json({ status: false, message: "Todos los campos son obligatorios." });
    } else {
      // validate if a user exist
      const exist = await pool.query(
        "SELECT * FROM users WHERE email = ? OR document_number = ? OR name_user = ?",
        [req.body.email, req.body.document_number, req.body.name_user]
      );
      if (Object.entries(exist).length === 0) {
        // definition json user
        let user = {
          document_number: req.body.document_number,
          pk_fk_id_document_type: req.body.pk_fk_id_document_type,
          fk_id_gender: req.body.fk_id_gender,
          name_user: req.body.name_user,
          first_name: req.body.first_name,
          second_name: req.body.second_name,
          surname: req.body.surname,
          second_surname: req.body.second_surname,
          email: req.body.email,
          password_user: req.body.password_user,
          created_att: req.body.created_att,
        };
        // insert user database
        const insert = await pool.query("INSERT INTO users SET ?", [user]);
        if (insert) {
          // definition json role_user
          let role = {
            pk_fk_document_number: req.body.document_number,
            pk_fk_id_document_type: req.body.pk_fk_id_document_type,
            pk_fk_id_roles: 3,
            roles_users_status: 2,
            created_att: req.body.created_att,
          };
          // associate user role to new registered user
          const role_user = await pool.query("INSERT INTO roles_users SET ?", [
            role,
          ]);
          if (role_user) {
            // response message servidor and cliente
            res
              .status(200)
              .json({ status: true, message: "Registro exitoso." });
          }
        } else {
          // response error servidor
          res.json({ status: false, message: "No se puede registrar." });
        }
      } else {
        // response error client when recording data
        res.status(404).json({
          status: false,
          message: "El usuario ya existe comunicarse con el administrador.",
        });
      }
    }
  }

  // authentication user in database
  public async authentication(req: Request, res: Response) {
    delete req.body.token;
    // secret jsonwebtoken
    let JWT_SECRET = config.SECRETKEYJSWEBTOKEN;
    if (req.body.email == "" || req.body.password_user == "") {
      res.status(404).json({
        status: false,
        message: "Todos los campos son obligatorios.",
      });
    } else {
      let user_auth = await pool.query(
        "SELECT u.first_name, u.second_name, u.surname, u.second_surname, u.email, u.name_file FROM users u INNER JOIN roles_users rl ON u.document_number = rl.pk_fk_document_number WHERE u.email = ? AND rl.roles_users_status !=2",
        [req.body.email]
      );
      let user_permit = await pool.query(
        "SELECT m.name_modules, ap.view_modules, ap.create_modules, ap.edit_modules, ap.delete_modules FROM users u INNER JOIN roles_users rl ON u.document_number = rl.pk_fk_document_number INNER JOIN roles r ON rl.pk_fk_id_roles = r.id_roles INNER JOIN access_permits ap ON r.id_roles = ap.fk_id_roles INNER JOIN modules m ON ap.fk_id_modules  = m.id_modules WHERE u.email = ? AND rl.roles_users_status !=2",
        [req.body.email]
      );
      if (Object.entries(user_auth).length === 0) {
        res.status(404).json({
          status: false,
          message:
            "El usuario esta desactivado comunicarse con el administrador.",
        });
      } else {
        // validation required fields
        if (req.body.email == "" || req.body.password_user == "") {
          res.status(404).json({
            status: false,
            message: "Todos los campos son obligatorios.",
          });
        } else {
          // exist email user
          const exist_email = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [req.body.email]
          );
          if (Object.entries(exist_email).length === 0) {
            res.status(404).json({
              status: false,
              message: "Correo electronico ó contraseña incorrectos.",
            });
          } else {
            // exist password user database
            const exist_password = await pool.query(
              "SELECT * FROM users WHERE password_user = ? AND email = ?",
              [req.body.password_user, req.body.email]
            );
            if (Object.entries(exist_password).length === 0) {
              res.status(404).json({
                status: false,
                message: "Correo electronico ó contraseña incorrectos.",
              });
            } else {
              // login user database
              let token = jsonwebtoken.sign(req.body.email, JWT_SECRET);
              res.status(200).send({
                singend_user: user_auth[0],
                permit: user_permit,
                token: token,
              });
            }
          }
        }
      }
    }
  }
}

export const authController = new AuthController();
