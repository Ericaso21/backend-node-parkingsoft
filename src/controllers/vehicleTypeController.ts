import {Request, Response} from 'express';
import pool from '../database';

class VehicleTypeController {

    // list vehicle types 
    public async list (req: Request, res: Response) {
        let vehicleTypes = await pool.query('SELECT * FROM vehicle_types WHERE status_vehicle !=0');
        res.status(200).json(vehicleTypes);
    }
    //get one vehicle type
    public async getOne (req: Request, res: Response){
        const { id } = req.params;
        let vehicleType = await pool.query('SELECT * FROM vehicle_types WHERE id_vehicle_type = ?',[id]);
        if (Object.entries(vehicleType).length === 0) {
            res.status(404).json({status: true, message: 'Tipo de vehiculo no encotrado'})
        } else {
            res.status(200).json(vehicleType);
        }
    }
    // create vehicle type
    public async create (req: Request, res: Response){
        delete req.body.token;
        if (req.body.vehicle_name == '') {
            res.status(404).json({status: false, message: 'Todos los campos son obligarios'});
        } else {
            let exist = await pool.query('SELECT * FROM vehicle_types WHERE vehicle_name = ?',[req.body.vehicle_name]);
            if (Object.entries(exist).length === 0) {
                let insert = await pool.query('INSERT INTO vehicle_types SET ?',[req.body]);
                if (insert) {
                    res.status(200).json({status: true, message: 'Datos guardados correctamente.'});
                } else {
                    res.status(500).json({status: false, message: 'No se pudo almacenar'});
                }
            } else {
                res.status(404).json({status: false, message: 'El nombre del tipo de vehiculo ya existe.'});
            }
            
        }
    }
    // update vehicle type
    public async update (req: Request, res: Response){
        delete req.body.token;
        const { id } = req.params;
        let exist = await pool.query('SELECT * FROM vehicle_types WHERE vehicle_name = ? AND id_vehicle_type != ?',[req.body.vehicle_name,id]);
        if (Object.entries(exist).length === 0) {
            let update = await pool.query('UPDATE vehicle_types SET ? WHERE id_vehicle_type = ?',[req.body,id]);
            if (update) {
                res.status(200).json({status: true, message: 'Datos actualizados correctamente.'});
            }
        } else {
            res.status(404).json({status: false, message: 'El nombre del tipo de vehiculo ya existe para otro ID'});
        }
    }
    //delete vehicle type
    public async delete (req: Request, res: Response){
        const { id } = req.params;
        let exist_vehicle = await pool.query('SELECT * FROM vehicles WHERE fk_id_vehicle_type = ?',[id]);
        if (Object.entries(exist_vehicle).length === 0) {
            let exist_rate = await pool.query('SELECT * FROM rates WHERE fk_id_vehicle_type = ?',[id]);
            if (Object.entries(exist_rate).length === 0) {
                let status_vehicle	= 0;
                let update = await pool.query('UPDATE vehicle_types SET status_vehicle = ? WHERE id_vehicle_type = ?',[status_vehicle,id]);
                if (update) {
                    res.status(200).json({status: true, message: 'Se ha elimnado con exito.'});
                } else {
                    res.status(500).json({status: false, message: 'No se ha podido eliminar.'});
                }
            } else {
                res.status(404).json({status: false, message: 'No se puede eliminar el tipo de vehiculo por que esta asociado a una tarifa.'});
            }
        } else {
            res.status(404).json({status: false, message: 'No se puede eliminar el tipo de vehiculo por que esta asociado a uno ó varios vehiculos.'});
        }
    }

}

export const vehicleTypeController = new VehicleTypeController();