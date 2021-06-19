import { Request, Response } from "express";
import pool from "../database";

class ReportController {
  //report bill mouthed
  public async list(req: Request, res: Response) {
    let bill = await pool.query(
      "SELECT id_bill, IF(CHAR_LENGTH(FORMAT(subtotal_value,3)) = 7, subtotal_value, FORMAT(subtotal_value,3)) as subtotal_value, IF(CHAR_LENGTH(FORMAT(iva_value,3)) = 7, iva_value, FORMAT(iva_value,3)) as iva_value, IF(CHAR_LENGTH(FORMAT(total_value,3)) = 7, total_value, FORMAT(total_value,3)) as total_value FROM bills WHERE bill_status != 0 AND MONTH(date_bill) = MONTH(CURDATE()) AND YEAR(date_bill) = YEAR(CURDATE())"
    );
    res.status(200).json(bill);
  }

  public async filter(req: Request, res: Response) {
    delete req.body.token;
    let filterData = await pool.query(
      `SELECT id_bill, IF(CHAR_LENGTH(FORMAT(subtotal_value,3)) = 7, subtotal_value, FORMAT(subtotal_value,3)) as subtotal_value, IF(CHAR_LENGTH(FORMAT(iva_value,3)) = 7, iva_value, FORMAT(iva_value,3)) as iva_value, IF(CHAR_LENGTH(FORMAT(total_value,3)) = 7, total_value, FORMAT(total_value,3)) as total_value FROM bills WHERE bill_status != 0 AND date_bill BETWEEN '${req.body.data_end}' AND '${req.body.data_begin}'`
    );
    res.status(200).json(filterData);
  }
}

export const reportController = new ReportController();
