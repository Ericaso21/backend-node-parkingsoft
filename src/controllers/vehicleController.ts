import { Request, Response } from 'express';
import pool from '../database';

class VehicleController {

    // list vehicles
    public async list(req: Request, res: Response) {
        let vehicles = await pool.query('SELECT v.vehicle_plate, tv.vehicle_name, v.fk_document_number, v.model_number, v.vehicle_status FROM vehicles v INNER JOIN vehicle_types tv ON v.fk_id_vehicle_type = tv.id_vehicle_type WHERE v.vehicle_status !=0');
        res.status(200).json(vehicles);
    }

    //get one vehicle and user
    public async getOne(req: Request, res: Response) {
        const { id } = req.params;
        let vehicle = await pool.query('SELECT * FROM vehicles WHERE vehicle_plate = ?', [id]);
        if (Object.entries(vehicle).length === 0) {
            res.status(404).json({ status: false, message: 'Vehiculo no encontrado.' });
        } else {
            res.status(200).json(vehicle[0]);
        }
    }

    //create vehicle 
    public async create(req: Request, res: Response) {
        delete req.body.token;
        if (req.body.vehicle_plate == '' || req.body.fk_document_number == '' || req.body.fk_id_document_type == 0 || req.body.fk_id_vehicle_type == 0 || req.body.vehicle_status == 0) {
            res.status(404).json({ status: false, message: 'Todos los campos son obligatorios.' });
        } else {
            let exist = await pool.query('SELECT * FROM vehicles WHERE vehicle_plate = ?', [req.body.vehicle_plate]);
            if (Object.entries(exist).length === 0) {
                let fk_id_document_type = await pool.query('SELECT pk_fk_id_document_type FROM users WHERE document_number = ?', [req.body.fk_document_number])
                if (Object.entries(fk_id_document_type).length === 0) {
                    res.status(404).json({ status: false, message: 'No existe el usuario' });
                } else {
                    let vehicle = {
                        vehicle_plate: req.body.vehicle_plate,
                        fk_document_number: req.body.fk_document_number,
                        fk_id_document_type: fk_id_document_type[0]['pk_fk_id_document_type'],
                        fk_id_vehicle_type: req.body.fk_id_vehicle_type,
                        model_number: req.body.model_number,
                        vehicle_status: req.body.vehicle_status,
                        created_att: req.body.created_att
                    }
                    let insert = await pool.query('INSERT INTO vehicles SET ?', [vehicle]);
                    if (insert) {
                        res.status(200).json({ status: true, message: 'Datos guardados correctamente.' });
                    } else {
                        res.status(500).json({ status: false, message: 'No se ha podido guardar.' });
                    }
                }
            } else {
                res.status(404).json({ status: false, message: 'La placa ya existe.' });
            }
        }
    }
    //update vehicle
    public async update(req: Request, res: Response) {
        delete req.body.token;
        const { id } = req.params;
        let exist = await pool.query('SELECT * FROM vehicles WHERE vehicle_plate = ? AND vehicle_plate != ?', [req.body.vehicle_plate, id]);
        if (Object.entries(exist).length === 0) {
            let fk_id_document_type = await pool.query('SELECT pk_fk_id_document_type FROM users WHERE document_number = ?', [req.body.fk_document_number]);
            if (Object.entries(fk_id_document_type).length === 0) {
                res.status(404).json({ status: false, message: 'No existe el usuario' });
            } else {
                let vehicle = {
                    vehicle_plate: req.body.vehicle_plate,
                    fk_document_number: req.body.fk_document_number,
                    fk_id_document_type: fk_id_document_type[0]['pk_fk_id_document_type'],
                    fk_id_vehicle_type: req.body.fk_id_vehicle_type,
                    model_number: req.body.model_number,
                    vehicle_status: req.body.vehicle_status,
                    updated_att: req.body.updated_att
                }
                let update = await pool.query('UPDATE vehicles SET ? WHERE vehicle_plate = ?', [vehicle, id]);
                if (update) {
                    res.status(200).json({ status: true, message: 'Datos actualizados correctamente.' });
                } else {
                    res.status(500).json({ status: false, message: 'No se ha podido actualizar.' });
                }
            }
        } else {
            res.status(404).json({ status: false, message: 'El vehiculo ya existe.' });
        }
    }
    //delete vehicle
    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        let vehicle_status = 0;
        let update_status = await pool.query('UPDATE vehicles SET vehicle_status = ? WHERE vehicle_plate = ?', [vehicle_status, id]);
        if (update_status) {
            res.status(200).json({ status: true, message: 'Se ha eliminado correctamente.' });
        } else {
            res.status(500).json({ status: false, message: 'No se pudo eliminar' })
        }
    }

}

export const vehicleController = new VehicleController();