import { Request, Response } from 'express';
import { flattenDiagnosticMessageText } from 'typescript';
import pool from '../database';

class AccessPermitsController {

    // list access permits
    public async list(req: Request, res: Response) {
        const permits = await pool.query("SELECT ap.id_access_permits, m.id_modules,m.name_modules, r.name_role, ap.view_modules, ap.create_modules, ap.edit_modules, ap.delete_modules,DATE_FORMAT(ap.created_att, '%d-%m-%Y') as created_att FROM access_permits ap INNER JOIN roles r ON ap.fk_id_roles = r.id_roles INNER JOIN modules m ON ap.fk_id_modules = m.id_modules ORDER BY r.id_roles,m.id_modules ASC");
        res.status(200).json(permits);
    }
    // get one permits role
    public async getOne(req: Request, res: Response) {
        const { id } = req.params;
        let permit = await pool.query('SELECT * FROM access_permits WHERE id_access_permits = ?', [id]);
        if (Object.entries(permit).length === 0) {
            res.status(404).json({ status: false, message: 'Datos no encontrados.' });
        } else {
            res.status(200).json(permit[0]);
        }
    }
    // create permits role
    public async create(req: Request, res: Response) {
        delete req.body.token;
        if (req.body.fk_id_roles == 0 || req.body.fk_id_modules == 0) {
            res.status(404).json({ status: false, message: 'Todos los campos son obligatorios.' });
        } else {
            // verificate if exist permiss associate to role and module
            let exist = await pool.query('SELECT * FROM access_permits WHERE fk_id_roles = ? AND fk_id_modules = ?', [req.body.fk_id_roles, req.body.fk_id_modules]);
            if (Object.entries(exist).length === 0) {
                // crete accesPermit database
                let insert = await pool.query('INSERT INTO access_permits SET ?', [req.body]);
                if (insert) {
                    res.status(200).json({ status: true, message: 'Datos guardados correctamente.' });
                } else {
                    res.json({ status: false, message: 'No se puede almacenar.' });
                }
            } else {
                res.status(404).json({ status: false, message: 'El permiso ya esta asociado a un rol y modulo.' });
            }
        }
    }
    //update permits role 
    public async update(req: Request, res: Response) {
        delete req.body.token;
        const { id } = req.params;
        let exist = await pool.query('SELECT * FROM access_permits WHERE (fk_id_roles = ? AND fk_id_modules != ?) AND (id_access_permits = ?)', [req.body.fk_id_roles, req.body.fk_id_modules, id]);
        if (Object.entries(exist).length === 0) {
            let update = await pool.query('UPDATE access_permits SET ? WHERE id_access_permits = ?', [req.body, id]);
            if (update) {
                res.status(200).json({ status: true, message: 'Datos actualizados correctamente.' });
            }
        } else {
            res.status(404).json({ status: false, message: 'El permiso ya esta asociado a otro ID.' });
        }
    }
    //delete permits role
    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        await pool.query('DELETE FROM access_permits WHERE id_access_permits = ?', [id]);
        res.status(200).json({ status: true, message: 'Se ha eliminado el permiso correctamente.' });
    }

}

export const accessPermitsController = new AccessPermitsController();