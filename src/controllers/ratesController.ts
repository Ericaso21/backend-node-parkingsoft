import {Request, Response} from 'express';
import pool from '../database';

class RatesController {

    // list rates
    public async list (req: Request, res: Response) {
        let rates = await pool.query('SELECT r.id_rate, vt.vehicle_name , r.minute_rate, IF(CHAR_LENGTH(r.hourly_rate) >= 3, r.hourly_rate, FORMAT(r.hourly_rate,3)) AS hourly_rate, IF(CHAR_LENGTH(r.day_rate) = 3,r.day_rate,FORMAT(r.day_rate,3)) AS day_rate, r.rate_status FROM rates r INNER JOIN vehicle_types vt ON r.fk_id_vehicle_type = vt.id_vehicle_type WHERE r.rate_status !=0');
        res.status(200).json(rates);
    }
    // getOne rate
    public async getOne (req: Request, res: Response){
        const { id } = req.params;
        let rate = await pool.query('SELECT id_rate, fk_id_vehicle_type, minute_rate, FORMAT(hourly_rate,3) AS hourly_rate, FORMAT(day_rate,3) AS day_rate, rate_status, created_att, updated_att FROM rates WHERE id_rate = ?',[id]);
        if (Object.entries(rate).length === 0) {
            res.status(404).json({status: false, message: 'Tarifa no encontrada.'});
        } else {
            res.status(200).json(rate);
        }
    }
    // creat rate
    public async create (req: Request, res: Response){
        delete req.body.token;
        if (req.body.fk_id_vehicle_type == 0 || req.body.minute_rate == 0 || req.body.hourly_rate == 0 || req.body.day_rate == 0 || req.body.rate_status == 0) {
            res.status(404).json({status: false, message: 'Todos los campos son obligatorios'});
        } else {
            let exist = await pool.query('SELECT * FROM rates WHERE fk_id_vehicle_type = ?',[req.body.fk_id_vehicle_type]);
            if (Object.entries(exist).length === 0) {
                let insert = await pool.query('INSERT INTO rates SET ?',[req.body]);
                if (insert) {
                    res.status(200).json({status: true, message: 'Datos guardados correctamente.'});
                } else {
                    res.status(500).json({status: false, message: 'No se ha podido almacenar.'});
                }
            } else {
                res.status(404).json({status: false, message: 'Ya existe una tarifa para el tipo de vehiculo.'});
            }
        }
    }

}

export const ratesController = new RatesController();