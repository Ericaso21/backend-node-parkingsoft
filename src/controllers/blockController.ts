import { Request, Response } from 'express';
import { FlowFlags } from 'typescript';
import pool from '../database';

class BlockController {

    // list block 
    public async list(req: Request, res: Response) {
        let blocks = await pool.query('SELECT b.id_block ,bt.name_block_type, b.block_number, b.block_status FROM blocks b INNER JOIN block_types bt ON bt.id_block_type = b.fk_id_block_type WHERE b.block_status != 0');
        res.status(200).json(blocks);
    }
    // getOne block
    public async getOne(req: Request, res: Response) {
        const { id } = req.params;
        let block = await pool.query('SELECT* FROM blocks WHERE id_block = ?', [id]);
        if (Object.entries(block).length === 0) {
            res.status(404).json({ status: false, message: 'Bloque no encontrado.' });
        } else {
            res.status(200).json(block[0]);
        }
    }
    // create block
    public async create(req: Request, res: Response) {
        delete req.body.token;
        if (req.body.fk_id_block_type == 0 || req.body.block_status == 0) {
            res.status(404).json({ status: false, message: 'Todos los campos son obligatorios.' });
        } else {
            let insert = await pool.query('INSERT INTO blocks SET ?', [req.body]);
            if (insert) {
                res.status(200).json({ status: true, message: 'Datos guardados correctamente.' });
            } else {
                res.status(500).json({ status: false, message: 'No se pudo insertar.' });
            }
        }
    }
    //udpte create 
    public async update(req: Request, res: Response) {
        delete req.body.token;
        const { id } = req.params;
        let update = await pool.query('UPDATE blocks SET ? WHERE id_block = ?', [req.body, id]);
        if (update) {
            res.status(200).json({ status: true, message: 'Datos actualizados correctamente.' });
        } else {
            res.status(500).json({ status: false, message: 'No se ha podido actualizar.' });
        }
    }

    //delete block
    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        let block_status = 0;
        let update = await pool.query('UPDATE blocks SET block_status = ? WHERE id_block = ?', [block_status, id]);
        if (update) {
            res.status(200).json({ status: true, message: 'Se ha eliminado exitosamente.' });
        } else {
            res.status(500).json({ status: false, message: 'No se ha podido eliminar.' });
        }
    }

}

export const blockController = new BlockController();