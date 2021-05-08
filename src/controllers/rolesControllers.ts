import {Request, Response} from 'express';
import pool from '../database';

class RolesController {

    // list database role
    public async list (req: Request, res: Response) {
        res.header('Cache-Control','private, no-cache, no-store, must-revalidate');
        let sql = await pool.query('SELECT * FROM roles WHERE role_status !=0');
        res.status(200).json(sql);
    }
    // get one role
    public async getOne (req: Request, res: Response) {
        const { id } = req.params;
        let getOne = await pool.query('SELECT * FROM roles WHERE id_roles = ?', [id]);
        if (Object.entries(getOne).length === 0) {
            res.status(404).json({status: false, message: 'Rol no encontrado.'})
        } else {
            res.header('Cache-Control','private, no-cache, no-store, must-revalidate');
            return res.status(200).json(getOne[0]);
        }
        res.status(200).json(getOne[0]);
    }
    //create new role
    public async create (req: Request, res: Response) {
        delete req.body.token;
        // invalidate required files
        if (req.body.name_role == '') {
            res.status(404).json({status: false, message: 'Todos los campos son obligatorios.'});
        } else {
            // select role if exists
            let exits = await pool.query('SELECT * FROM roles WHERE name_role = ?',[req.body.name_role]);
            if (Object.entries(exits).length === 0) {
                // create role in basedata
                let insert = await pool.query('INSERT INTO roles SET ?',[req.body]);
                if (insert) {
                    res.status(200).json({status: true, message: 'Datos guardados correctamente.'});
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
        let exists = await pool.query('SELECT * FROM roles_users WHERE pk_fk_id_roles = ?',[id]);
        if (Object.entries(exists).length === 0) {
            let role_status = 0
            let update = await pool.query('UPDATE roles SET role_status = ? WHERE id_roles = ?',[role_status,id]);
            if (update) {
                res.status(200).json({status: true, message: 'Se ha eliminado correctamente.'});
            } else {
                res.status(404).json({status: false, message: 'No se ha podido eliminar.'})
            }
        } else {
            res.status(404).json({status: false, message: 'El rol esta asociado a uno o varios empleados no se puede eliminar.'})
        }
    }

}

export const rolesController = new RolesController();