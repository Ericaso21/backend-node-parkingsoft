import { Request, Response } from 'express';
import pool from '../database';

class TicketsController {

    // list tickets 
    public async list(req: Request, res: Response) {
        let tickets = await pool.query('SELECT t.id_ticket, TIME_FORMAT(t.entry_time, "%H:%i:%s %p") as entry_time, TIME_FORMAT(t.departure_time, "%H:%i:%s %p") as departure_time, SEC_TO_TIME(IF(t.entry_time<t.departure_time, TIMESTAMPDIFF(SECOND,t.entry_time,t.departure_time), TIMESTAMPDIFF(SECOND,t.departure_time,t.entry_time))) AS total_time, t.tickets_status, b.block_number, v.vehicle_plate FROM tickets t INNER JOIN tickets_block tb ON tb.pk_fk_id_ticket = t.id_ticket INNER JOIN vehicles v ON tb.fk_id_vehicle = v.vehicle_plate INNER JOIN blocks b ON tb.pk_fk_id_block = b.id_block WHERE t.tickets_status !=0');
        res.status(200).json(tickets);
    }

    //get one ticket pdf
    public async getOnePDF(req: Request, res: Response) {
        const { id } = req.params;
        let ticket = await pool.query('SELECT t.id_ticket, TIME_FORMAT(t.entry_time, "%H:%i:%s %p") as entry_time, TIME_FORMAT(t.departure_time, "%H:%i:%s %p") as departure_time, SEC_TO_TIME(IF(t.entry_time<t.departure_time, TIMESTAMPDIFF(SECOND,t.entry_time,t.departure_time), TIMESTAMPDIFF(SECOND,t.departure_time,t.entry_time))) AS total_time, tb.pk_fk_id_block, tb.fk_id_vehicle FROM tickets t INNER JOIN tickets_block tb ON tb.pk_fk_id_ticket = t.id_ticket WHERE t.id_ticket = ?', [id]);
        if (Object.entries(ticket).length === 0) {
            res.status(404).json({ status: false, message: 'Ticket no encontrado.' });
        } else {
            res.status(200).json(ticket[0]);
        }
    }
    //get one tickets
    public async getOne(req: Request, res: Response) {
        const { id } = req.params;
        let ticket = await pool.query('SELECT t.id_ticket, DATE_FORMAT(t.entry_time, "%Y-%m-%dT%H:%i:%s") as entry_time, DATE_FORMAT(t.departure_time, "%Y-%m-%dT%H:%i:%s") as departure_time, t.tickets_status, tb.pk_fk_id_block,tb.fk_id_vehicle FROM tickets t INNER JOIN tickets_block tb ON tb.pk_fk_id_ticket = t.id_ticket WHERE t.id_ticket = ?', [id]);
        if (Object.entries(ticket).length === 0) {
            res.status(404).json({ status: false, message: 'Ticket no encontrado.' });
        } else {
            res.status(200).json(ticket[0]);
        }
    }
    //create ticket
    public async create(req: Request, res: Response) {
        delete req.body.token;
        if (req.body.entry_time == '' || req.body.tickets_status == 0) {
            res.status(404).json({ status: false, message: 'Todos los campos son obligatorios.' });
        } else {
            let ticket = {
                entry_time: req.body.entry_time,
                tickets_status: 1,
                created_att: req.body.created_att
            }
            let insert = await pool.query('INSERT INTO tickets SET ?', [ticket]);
            let pk_fk_id_ticket = await pool.query('SELECT last_insert_id() AS pk_fk_id_ticket')
            if (insert) {
                let block_ticket = {
                    pk_fk_id_block: req.body.pk_fk_id_block,
                    pk_fk_id_ticket: pk_fk_id_ticket[0]['pk_fk_id_ticket'],
                    fk_id_vehicle: req.body.fk_id_vehicle,
                    status_ticket_block: 1,
                    created_att: req.body.created_att
                }
                let insert_bt = await pool.query('INSERT INTO tickets_block SET ?', [block_ticket]);
                if (insert_bt) {
                    let update_block = await pool.query('UPDATE blocks SET block_status = 2 WHERE id_block = ?', [req.body.pk_fk_id_block]);
                    if (update_block) {
                        res.status(200).json({ status: true, message: 'Datos guardados correctamente.', id_ticket: pk_fk_id_ticket[0]['pk_fk_id_ticket'] });
                    } else {
                        res.status(500).json({ status: false, message: 'No se pudo actualizar bloque.' })
                    }
                } else {
                    res.status(500).json({ status: false, message: 'No se pudo guardar datos.' })
                }
            } else {
                res.status(500).json({ status: false, message: 'No se pudo guardar datos.' })
            }
        }
    }

    // update tickets
    public async update(req: Request, res: Response) {
        delete req.body.token;
        const { id } = req.params;
        let ticket = {
            departure_time: req.body.departure_time,
            tickets_status: 2,
            updated_att: req.body.updated_att
        }
        let update = await pool.query('UPDATE tickets SET ? WHERE id_ticket = ?', [ticket, id]);
        if (update) {
            let block_ticket = {
                status_ticket_block: 2,
                updated_att: req.body.updated_att
            }
            let bt = await pool.query('UPDATE tickets_block SET ? WHERE pk_fk_id_ticket = ?', [block_ticket, id]);
            if (bt) {
                let update_block = await pool.query('UPDATE blocks SET block_status = 1 WHERE id_block = ?', [req.body.pk_fk_id_block]);
                if (update_block) {
                    res.status(200).json({ status: true, message: 'Datos actualizados correctamente.', id_ticket: id });
                } else {
                    res.status(500).json({ status: false, message: 'Error a el actualizar.' });
                }
            } else {
                res.status(500).json({ status: false, message: 'Error a el actualizar.' });
            }
        } else {
            res.status(500).json({ status: false, message: 'Error a el actualizar.' });
        }
    }

    // delete ticket
    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        let tickets_status = 0;
        let update_ticket = pool.query('UPDATE tickets SET tickets_status = ? WHERE id_ticket = ?', [tickets_status, id]);
        if (update_ticket) {
            let status_ticket_block = 0;
            let update_tb = await pool.query('UPDATE tickets_block SET status_ticket_block = ? WHERE pk_fk_id_ticket = ?', [status_ticket_block, id]);
            if (update_tb) {
                res.status(200).json({ status: true, message: 'Se ha eliminado correctamente.' })
            } else {
                res.status(500).json({ status: false, message: 'No se ha podido eliminar.' })
            }
        } else {
            res.status(500).json({ status: false, message: 'No se ha podido eliminar.' })
        }
    }

}

export const ticketsController = new TicketsController();