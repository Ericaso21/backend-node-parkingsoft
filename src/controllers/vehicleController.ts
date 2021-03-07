import {Request, Response} from 'express';
import pool from '../database';

class VehicleController {

    // list vehicles
    public async list (req: Request, res: Response) {
        let vehicles = await pool.query('SELECT * FROM vehicles WHERE vehicle_status !=0');
        res.status(200).json(vehicles);
    }

    //get one vehicle and user
    public async getOne(req: Request, res: Response){
        const { id } = req.params;
        let vehicle = await pool.query('SELECT u.document_number, d.id_document_type, u.first_name, u.second_name, u.surname, u.second_surname, v.vehicle_plate, vt.vehicle_name, u.model_number FROM users u INNER JOIN document_types d ON u.pk_fk_id_document_type = d.id_document_type INNER JOIN vehicles v ON v.vehicle_plate = u.document_number INNER JOIN vehicle_types vt ON v.fk_id_vehicle_type = vt.id_vehicle_type WHERE v.vehicle_plate = ? AND v.vehicle_status !=0',[id]);
        res.status(200).json(vehicle);
    }

}

export const vehicleController = new VehicleController();