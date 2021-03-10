import {Request, Response} from 'express';
import pool from '../database';

class BlockTypesController {

    // list block types 
    public async list (req: Request, res: Response) {
        let blockTypes = await pool.query('SELECT * FROM block_types WHERE block_status !=0');
        res.status(200).json(blockTypes);
    }
    // geo one block type
    public async getOne (req: Request, res: Response){
        const { id } = req.params;
        let blockType = await pool.query('SELECT * FROM block_types WHERE id_block_type = ?',id);
        if (Object.entries(blockType).length === 0) {
            res.status(404).json({status: false, message: 'El tipo de bloque no existe.'});
        } else {
            res.status(200).json(blockType);
        }
    }
    // create block type
    public async create (req: Request, res: Response){
        delete req.body.token;
        if (req.body.name_block_type == '' || req.body.block_status == 0) {
            res.status(404).json({staus: false, message: 'Todos los campos son obligatorios.'});
        } else {
            let exist = await pool.query('SELECT * FROM block_types WHERE name_block_type = ? AND block_status !=0',[req.body.name_block_type]);
            if (Object.entries(exist).length === 0) {
                let insert = await pool.query('INSERT INTO block_types SET ?',[req.body]);
                if (insert) {
                    res.status(200).json({status: true, message: 'Datos guardados correctamente.'});
                } else {
                    res.status(500).json({status: false, message: 'No se ha podido insertar.'});
                }
            } else {
                res.status(404).json({status: false, message: 'El tipo de bloque ya existe.'})
            }
        }
    }
    //update block type
    public async update (req: Request, res: Response){
        delete req.body.token;
        const { id } = req.params;
        let exist = await pool.query('SELECT * FROM block_types WHERE name_block_type = ? AND id_block_type != ?',[req.body.name_block_type,id]);
        if (Object.entries(exist).length === 0) {
            let update = await pool.query('UPDATE block_types SET ? WHERE id_block_type = ?',[req.body,id]);
            if (update) {
                res.status(200).json({status: true, message: 'Datos actualizados correctamente.'});
            } else {
                res.status(500).json({status: false, message: 'No se ha podido actualizar.'});
            }
        } else {
            res.status(404).json({status: false, message: 'EL nombre del bloque ya existe.'});
        }
    }
    // delete block_type
    public async delete (req: Request, res: Response){
        const { id } = req.params;
        let exist_block = await pool.query('SELECT * FROM blocks WHERE fk_id_block_type = ?',[id]);
        if (Object.entries(exist_block).length === 0) {
            let block_status = 0
            let update = await pool.query('UPDATE block_types SET block_status = ? WHERE id_block_type = ?',[block_status,id]);
            if (update) {
                res.status(200).json({status: true, message: 'Se ha elimnado correctamente.'});
            } else {
                res.status(500).json({status: false, message: 'Error de eliminacion.'});
            }
        } else {
            res.status(404).json({status: false, message: 'El tipo de bloque existe en el bloque.'});
        }
    }
}

export const blockTypesController = new BlockTypesController();