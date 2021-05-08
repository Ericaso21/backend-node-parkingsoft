import { Request, Response } from 'express';
import pool from '../database';

class BillController {

    //get ticket vehicle name user
    public async getTicket(req: Request, res: Response) {
        const { id } = req.params;
        let ticket = await pool.query('SELECT t.id_ticket, TIME_FORMAT(t.entry_time, "%H:%i:%s %p") as entry_time, TIME_FORMAT(t.departure_time, "%H:%i:%s %p") as departure_time, SEC_TO_TIME(IF(t.entry_time<t.departure_time, TIMESTAMPDIFF(SECOND,t.entry_time,t.departure_time), TIMESTAMPDIFF(SECOND,t.departure_time,t.entry_time))) AS total_time, tb.pk_fk_id_block, tb.fk_id_vehicle, v.fk_document_number, u.first_name, u.surname, DATE_FORMAT(b.date_bill,"%d/%m/%Y") as date_bill, IF(CHAR_LENGTH(FORMAT(b.subtotal_value,3)) = 7, b.subtotal_value, FORMAT(b.subtotal_value,3)) AS subtotal_value, IF(CHAR_LENGTH(FORMAT(b.iva_value,3)) = 7, b.iva_value, FORMAT(b.iva_value,3)) AS iva_value,  IF(CHAR_LENGTH(FORMAT(b.total_value,3)) = 7, b.total_value, FORMAT(b.total_value,3)) AS total_value FROM tickets t INNER JOIN tickets_block tb ON tb.pk_fk_id_ticket = t.id_ticket INNER JOIN vehicles v ON tb.fk_id_vehicle = v.vehicle_plate INNER JOIN users u ON v.fk_document_number = u.document_number INNER JOIN bills b ON b.fk_id_ticket = t.id_ticket WHERE t.id_ticket = ?', [id]);
        if (Object.entries(ticket).length === 0) {
            res.status(404).json({ status: false, message: 'Ticket no encontrado.' });
        } else {
            res.status(200).json(ticket[0]);
        }
    }

    //get information bill
    public async getBill(req: Request, res: Response) {
        let bill = await pool.query('SELECT b.id_bill , TIME_FORMAT(t.entry_time, "%H:%i:%s %p") as entry_time, TIME_FORMAT(t.departure_time, "%H:%i:%s %p") as departure_time, SEC_TO_TIME(IF(t.entry_time<t.departure_time, TIMESTAMPDIFF(SECOND,t.entry_time,t.departure_time), TIMESTAMPDIFF(SECOND,t.departure_time,t.entry_time))) AS total_time, tb.pk_fk_id_block, tb.fk_id_vehicle, v.fk_document_number, u.first_name, u.surname, DATE_FORMAT(b.date_bill,"%d/%m/%Y") as date_bill, IF(CHAR_LENGTH(FORMAT(b.subtotal_value,3)) = 7, b.subtotal_value, FORMAT(b.subtotal_value,3)) AS subtotal_value, IF(CHAR_LENGTH(FORMAT(b.iva_value,3)) = 7, b.iva_value, FORMAT(b.iva_value,3)) AS iva_value,  IF(CHAR_LENGTH(FORMAT(b.total_value,3)) = 7, b.total_value, FORMAT(b.total_value,3)) AS total_value FROM tickets t INNER JOIN tickets_block tb ON tb.pk_fk_id_ticket = t.id_ticket INNER JOIN vehicles v ON tb.fk_id_vehicle = v.vehicle_plate INNER JOIN users u ON v.fk_document_number = u.document_number INNER JOIN bills b ON b.fk_id_ticket = t.id_ticket WHERE b.bill_status !=0 AND t.tickets_status !=0')
        res.status(200).json(bill);
    }

    //create bill
    public async create(req: Request, res: Response) {
        delete req.body.token;
        if (req.body.fk_id_ticket == 0) {
            res.status(404).json({ status: false, message: 'Todos los campos son obligatorios.' });
        } else {
            const iva = 0.19;
            let rates = await pool.query('SELECT r.id_rate, r.fk_id_vehicle_type, r.minute_rate, IF(CHAR_LENGTH(FORMAT(r.hourly_rate,3)) = 7, r.hourly_rate, FORMAT(r.hourly_rate,3)) AS hourly_rate, IF(CHAR_LENGTH(FORMAT(r.day_rate,3)) = 7,r.day_rate,FORMAT(r.day_rate,3)) AS day_rate FROM rates r WHERE r.rate_status !=0');
            let time = await pool.query('SELECT IF(t.entry_time<t.departure_time, TIMESTAMPDIFF(SECOND,t.entry_time,t.departure_time), TIMESTAMPDIFF(SECOND,t.departure_time,t.entry_time)) AS total_time, v.fk_id_vehicle_type FROM tickets t INNER JOIN tickets_block tb ON t.id_ticket = tb.pk_fk_id_ticket INNER JOIN vehicles v ON tb.fk_id_vehicle = v.vehicle_plate WHERE t.id_ticket = ?', [req.body.id_ticket]);
            let subtotal_value = 0;
            for (let i = 0; i < rates.length; i++) {
                if (rates[i]['fk_id_vehicle_type'] == time[0]['fk_id_vehicle_type']) {
                    if (time[0]['total_time'] >= 0 && time[0]['total_time'] <= 3600 && time[0]['total_time'] != 0) {
                        var minu_total = time[0]['total_time'] / 60;
                        subtotal_value = minu_total * rates[i]['minute_rate']
                    } else if (time[0]['total_time'] >= 3600 && time[0]['total_time'] <= 86399 && time[0]['total_time'] != 0) {
                        var hora_total = time[0]['total_time'] / 3600;
                        subtotal_value = hora_total * rates[i]['hourly_rate']
                    } else {
                        var day_total = time[0]['total_time'] / 86400;
                        subtotal_value = day_total * rates[i]['day_rate']
                    }
                }
            }
            function val(x: any) {
                var contador = x.toString().split('.')
                if (contador[0].length == 2 && contador[1].length == 1) {
                    return x.toFixed(0)
                }
                if (contador[0].length == 2) {
                    return x.toFixed(3)
                } else if (contador[0].length == 3) {
                    return x.toFixed(0)
                } else if (contador[0].length == 4) {
                    var dato = x /= 1000
                    return dato.toFixed(3)
                }
                else {
                    return x.toFixed(3)
                }
            }
            let iva_total = subtotal_value * iva;
            let total = subtotal_value + iva_total;
            let bill = {
                fk_id_ticket: req.body.id_ticket,
                fk_id_payment_method: 1,
                date_bill: new Date(),
                subtotal_value: val(subtotal_value),
                iva_value: val(iva_total),
                total_value: val(total),
                bill_status: 1,
                created_att: new Date()
            }
            let insert = await pool.query('INSERT INTO bills SET ?', [bill]);
            if (insert) {
                res.status(200).json({ status: true, message: 'Datos guardados correctamente.', id_ticket: req.body.id_ticket });
            } else {
                res.status(500).json({ status: false, message: 'No se pudo insertar.' });
            }
        }
    }

    public async deleteBill(req: Request, res: Response) {
        const { id } = req.params;
        let updated_att = new Date();
        let update_bill = await pool.query('UPDATE bills SET bill_status = 0, updated_att = ? WHERE id_bill = ?', [updated_att, id]);
        if (update_bill) {
            res.status(200).json({ status: true, message: 'Se ha eliminado correctamente.' })
        } else {
            res.status(500).json({ status: false, message: 'No se ha podido eliminar.' })
        }
    }

}

export const billController = new BillController();