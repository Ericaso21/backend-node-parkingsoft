import { Request, Response } from "express";
import pool from "../database";

class ClientController {
  //get vehicle register user
  public async getVehiciclesUser(req: Request, res: Response) {
    const vehicle = await pool.query(
      "SELECT u.email, v.vehicle_plate, v.model_number, v.name_file, tp.vehicle_name FROM users u INNER JOIN vehicles v ON u.document_number = v.fk_document_number INNER JOIN vehicle_types tp ON v.fk_id_vehicle_type = tp.id_vehicle_type WHERE u.email = ? AND v.vehicle_status !=0",
      [req.body.email]
    );
    if (Object.entries(vehicle).length === 0) {
      res
        .status(404)
        .json({ status: false, message: "No tiene vehiculos registrados" });
    } else {
      res.status(200).json(vehicle);
    }
  }

  //get vehicle user update
  public async getVehicle(req: Request, res: Response) {
    const { id } = req.params;
    let vehicle = await pool.query(
      "SELECT vehicle_plate, model_number FROM vehicles WHERE vehicle_plate = ?",
      [id]
    );
    if (Object.entries(vehicle).length === 0) {
      res
        .status(404)
        .json({ status: false, message: "Vehiculo no encontrado" });
    } else {
      res.status(200).json(vehicle[0]);
    }
  }

  //update vehicle client
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    let vehicle = await pool.query(
      "SELECT * FROM vehicles WHERE vehicle_plate = ? AND vehicle_plate != ?",
      [req.body.vehicle_plate, id]
    );
    if (Object.entries(vehicle).length === 0) {
      let vehicle = {
        vehicle_plate: req.body.vehicle_plate,
        model_number: req.body.model_number,
      };
      let update = await pool.query(
        "UPDATE vehicles SET ? WHERE vehicle_plate = ?",
        [vehicle, id]
      );
      if (update) {
        res
          .status(200)
          .json({ status: true, message: "Datos actualizados correctamente." });
      } else {
        res
          .status(500)
          .json({ status: false, message: "Error a el actualizar" });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "La placa ya existe",
      });
    }
  }

  //updateFile image vehicle
  public async updateImageVehicle(req: any, res: Response) {
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
        "UPDATE vehicles SET ? WHERE vehicle_plate  = ?",
        [image, id]
      );
      if (updateImage) {
        var file = req.files.File;
        file.mv(`./public/static/img/vehicle/${file.name}`, (err: any) => {
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
}

export const clientController = new ClientController();
