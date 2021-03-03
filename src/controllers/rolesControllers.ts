import {Request, Response} from 'express';
import pool from '../database';

class RolesController {

    // list database role
    public async list (req: Request, res: Response) {
        let sql = await pool.query('SELECT * FROM roles');
        res.status(200).json(sql);
    }
    // get one role
    public async getOne (req: Request, res: Response) {
        const { id } = req.params;
        let getOne = await pool.query('SELECT * FROM roles WHERE id_roles = ?', [id]);
        res.status(200).json(getOne);
    }

    public async create (req: Request, res: Response) {
        delete req.body.token;
        if (req.body.name_role == '') {
            res.status(404).json({status: false, message: 'Todos los campos son obligatorios.'});
        } else {
            let exits = await pool.query('SELECT * FROM roles WHERE name_role = ?',[req.body.name_role]);
            if (Object.entries(exits).length === 0) {
                let insert = await pool.query('INSERT INTO roles SET ?',[req.body]);
                if (insert) {
                    res.status(200).json({status: true, message: 'Datos guardados.'});
                } else {
                    res.json({status: false, message: 'No se puede almacenar.'});
                }
            } else {
                res.status(404).json({status: false, message: 'El nombre del rol ya existe.'})
            }
        }
    }

    public async update (req: Request, res: Response){
        delete req.body.token;
        const { id } = req.params;
        let sql = await pool.query('SELECT * FROM roles WHERE name_role = ? AND id_roles != ?', [req.body.name_role,id]);
        if (Object.entries(sql).length === 0) {
            let update = await pool.query('UPDATE roles SET ? WHERE id_roles = ?',[req.body,id]);
            if (update) {
                res.status(200).json({status: true, message: 'Datos actualizados correctamente.'});
            }
        } else {
            res.status(404).json({status: false, message: 'El nombre del rol ya existe en otro id.'});
        }
    }

    public async delete (req: Request, res: Response){
        const { id } = req.params;
        await pool.query('DELETE FROM roles WHERE id_roles = ?',[id]);
        res.status(200).json({status: true, message:'Eliminado correctamente.'});
    }

}

export const rolesController = new RolesController();