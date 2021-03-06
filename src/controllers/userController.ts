import { Request, Response } from "express";
import pool from "../database";
import path from "path";

class UserController {
  //user profile

  public async userProfile(req: Request, res: Response) {
    const { id } = req.params;
    let userProfile = await pool.query(
      "SELECT u.document_number, u.name_user, concat_ws(' ',u.first_name,u.second_name) AS first_name, concat_ws(' ', u.surname,u.second_surname) AS surname, TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS birthdate, u.address, u.telephone, u.email, u.name_file, r.name_role, r.description_role FROM users u INNER JOIN roles_users rl ON u.document_number = rl.pk_fk_document_number INNER JOIN roles r ON rl.pk_fk_id_roles = r.id_roles WHERE u.email = ?",
      [id]
    );
    res.status(200).json(userProfile[0]);
  }

  //update useProfile
  public async updateUserProfile(req: Request, res: Response) {
    const { id } = req.params;
    const userProfile = {
      first_name: req.body.first_name,
      second_name: req.body.second_name,
      surname: req.body.surname,
      second_surname: req.body.second_surname,
      name_user: req.body.name_user,
      address: req.body.address,
      email: req.body.email,
      telephone: req.body.telephone,
    };
    let update = await pool.query(
      "UPDATE users SET ? WHERE document_number = ?",
      [userProfile, id]
    );
    if (update) {
      res.status(200).json({
        status: true,
        message: "Datos actualizados correctamente.",
      });
    } else {
      res
        .status(404)
        .json({ status: false, message: "No se pudo actualizar." });
    }
  }

  //getUserdata UpdateProfile
  public async getUserData(req: Request, res: Response) {
    let user_auth = await pool.query(
      "SELECT u.first_name, u.second_name, u.surname, u.second_surname, u.email, u.name_file, rl.pk_fk_id_roles FROM users u INNER JOIN roles_users rl ON u.document_number = rl.pk_fk_document_number WHERE u.email = ? AND rl.roles_users_status !=2",
      [req.body.email]
    );
    if (Object.entries(user_auth).length === 0) {
      res
        .status(400)
        .json({ status: false, message: "No se ha encontrado data" });
    } else {
      res.status(200).json(user_auth[0]);
    }
  }

  //update profile image
  public async updateProfileImage(req: any, res: any) {
    if (req.files === null) {
      res
        .status(404)
        .json({ status: false, message: "No hemos encontrado la imagen" });
    } else {
      const { id } = req.params;
      let image = {
        name_file: req.files.File.name,
        type_file: req.files.File.mimetype,
      };
      let updateImage = await pool.query(
        "UPDATE users SET ? WHERE document_number = ?",
        [image, id]
      );
      if (updateImage) {
        var file = req.files.File;
        file.mv(`./public/static/img/user/${file.name}`, (err: any) => {
          if (err) return res.status(500).send({ message: err });
          return res
            .status(200)
            .send({ status: true, message: "Imagen actualizada" });
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: "No se pudo actualizar." });
      }
    }
  }
  // list user
  public async list(req: Request, res: Response) {
    let users = await pool.query(
      "SELECT u.document_number, tp.document_type_acronym, g.gender_acronym, u.name_user, u.first_name, u.second_name, u.surname, u.second_surname, u.email, r.name_role, ru.roles_users_status,DATE_FORMAT(u.created_att, '%d-%m-%Y') as created_att FROM users u INNER JOIN roles_users ru ON u.document_number = ru.pk_fk_document_number INNER JOIN roles r ON ru.pk_fk_id_roles = r.id_roles INNER JOIN document_types tp ON u.pk_fk_id_document_type  = tp.id_document_type INNER JOIN genders g ON u.fk_id_gender  = g.id_gender WHERE ru.roles_users_status != 0"
    );
    res.status(200).json(users);
  }

  // get one user database
  public async getOne(req: Request, res: Response) {
    const { id } = req.params;
    let user = await pool.query(
      "SELECT u.document_number, u.pk_fk_id_document_type, u.fk_id_gender, u.name_user, concat_ws(' ', u.first_name,u.second_name) as first_name, concat_ws(' ', u.surname,u.second_surname) as surname, u.email, r.id_roles as pk_fk_id_roles, ru.roles_users_status FROM users u INNER JOIN roles_users ru ON u.document_number = ru.pk_fk_document_number INNER JOIN roles r ON ru.pk_fk_id_roles = r.id_roles INNER JOIN document_types tp ON u.pk_fk_id_document_type  = tp.id_document_type INNER JOIN genders g ON u.fk_id_gender  = g.id_gender WHERE u.document_number = ?",
      [id]
    );
    if (Object.entries(user).length === 0) {
      res.status(404).json({ status: false, message: "Usuario no encontrado" });
    } else {
      return res.status(200).json(user[0]);
    }
  }

  // create user database
  public async create(req: Request, res: Response) {
    delete req.body.token;
    if (
      (req.body.document_number == "" || req.body.pk_fk_id_document_type === 0,
      req.body.fk_id_gender == 0 ||
        req.body.first_name == "" ||
        req.body.surname == "" ||
        req.body.email == "" ||
        req.body.password_user == "")
    ) {
      res
        .status(404)
        .json({ status: false, message: "Todos los campos son obligatorios." });
    } else {
      // validate if a user exist
      const exist = await pool.query(
        "SELECT * FROM users WHERE email = ? OR document_number = ?",
        [req.body.email, req.body.document_number]
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
            pk_fk_id_roles: req.body.pk_fk_id_roles,
            roles_users_status: req.body.roles_users_status,
            created_att: req.body.created_att,
          };
          // associate user role to new registered user
          const role_user = await pool.query("INSERT INTO roles_users SET ?", [
            role,
          ]);
          if (role_user) {
            // response message servidor and cliente
            res.status(200).json({
              status: true,
              message: "Datos guardados correctamente.",
            });
          }
        } else {
          // response error servidor
          res.json({ status: false, message: "No se puede registrar." });
        }
      } else {
        // response error client when recording data
        res.status(404).json({
          status: false,
          message:
            "El documento ya existe ó correo electronico verificar tambien el nombre de usuario.",
        });
      }
    }
  }

  //update user database
  public async update(req: Request, res: Response) {
    delete req.body.token;
    const { id } = req.params;
    let consultation = await pool.query(
      "SELECT * FROM users WHERE email = ? AND document_number != ? AND document_number != ? OR name_user = ? AND document_number != ?",
      [req.body.email, id, req.body.document_number, id, req.body.name_user, id]
    );
    console.log(consultation);
    if (Object.entries(consultation).length === 0) {
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
        updated_att: req.body.updated_att,
      };
      if (user["password_user"] == null) {
        delete user["password_user"];
      } else {
        user["password_user"] = req.body.password_user;
      }
      // update user
      let update_user = await pool.query(
        "UPDATE users SET ? WHERE document_number = ?",
        [user, id]
      );
      if (update_user) {
        // definition json role_user
        let role = {
          pk_fk_document_number: req.body.document_number,
          pk_fk_id_document_type: req.body.pk_fk_id_document_type,
          pk_fk_id_roles: req.body.pk_fk_id_roles,
          roles_users_status: req.body.roles_users_status,
          updated_att: req.body.updated_att,
        };
        let update_role = await pool.query(
          "UPDATE roles_users SET ? WHERE pk_fk_document_number = ?",
          [role, id]
        );
        if (update_role) {
          res.status(200).json({
            status: true,
            message: "Datos actualizados correctamente.",
          });
        } else {
          res
            .status(404)
            .json({ status: false, message: "No se pudo actualizar." });
        }
      } else {
        res
          .status(404)
          .json({ status: false, message: "No se pudo actualizar." });
      }
    } else {
      res.status(404).json({
        status: false,
        message:
          "El correo electronico, nombre de usuario ó documento de identidad estan asociados a otro usuario.",
      });
    }
  }

  // delete user change status
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    let update_vehicle = await pool.query(
      `SELECT * FROM vehicles WHERE fk_document_number = ${id}`
    );
    if (Object.entries(update_vehicle).length === 0) {
      let roles_users_status = 0;
      let update_status = await pool.query(
        `UPDATE roles_users SET roles_users_status = ${roles_users_status} WHERE pk_fk_document_number = ${id}`
      );
      if (update_status) {
        res
          .status(200)
          .json({ status: true, message: "Usuario eliminado con exito." });
      }
    } else {
      res.status(404).json({
        status: false,
        message:
          "El usuario no se puede eliminar por que esta asociado a un vehiculo.",
      });
    }
  }
}

export const userController = new UserController();
