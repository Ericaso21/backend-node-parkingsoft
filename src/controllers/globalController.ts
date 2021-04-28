import { Request, Response } from 'express';
import pool from '../database';

class GlobalController {

    // bring data document_types database 
    public async listDocumentType(req: Request, res: Response) {
        let document_types = await pool.query('SELECT id_document_type, document_type_name FROM document_types WHERE statu_type_acronym != 0');
        res.status(200).json(document_types);
    }

    //brind data roles database
    public async listRoles(req: Request, res: Response) {
        let role = await pool.query('SELECT id_roles, name_role FROM roles WHERE role_status != 0');
        res.status(200).json(role);
    }

    //brind data gender database
    public async listGender(req: Request, res: Response) {
        let genders = await pool.query('SELECT id_gender, name_gender, gender_acronym FROM genders WHERE gender_status != 0');
        res.status(200).json(genders);
    }

    //brind data modules database
    public async listModules(req: Request, res: Response) {
        let modules = await pool.query('SELECT id_modules, name_modules FROM modules WHERE status_module != 0');
        res.status(200).json(modules);
    }
    // brind data user database+
    public async listUser(req: Request, res: Response) {
        let users = await pool.query('SELECT u.document_number, u.pk_fk_id_document_type, u.first_name, u.second_name, u.surname, u.second_surname FROM users u INNER JOIN roles_users rl ON u.document_number = rl.pk_fk_document_number WHERE rl.pk_fk_id_roles = 3');
        res.status(200).json(users);
    }
    // bridn data vehicle types
    public async listVehicleTypes(req: Request, res: Response) {
        let vehicleTypes = await pool.query('SELECT id_vehicle_type, vehicle_name FROM vehicle_types WHERE status_vehicle !=0');
        res.status(200).json(vehicleTypes);
    }
    // brind data block Types
    public async listBlockTypes(req: Request, res: Response) {
        let blockTypes = await pool.query('SELECT id_block_type, name_block_type FROM blocks WHERE id_block_type !=0');
        res.status(200).json(blockTypes);
    }
    // vrind data blocks
    public async listBlock(req: Request, res: Response) {
        let blocks = await pool.query('SELECT b.id_block, bt.name_block_type, b.block_number FROM blocks b INNER JOIN block_types bt ON bt.id_block_type = b.fk_id_block_type WHERE b.block_status != 0 AND b.block_status != 2');
        res.status(200).json(blocks);
    }

    //validate data blocks close
    public async listBlockClose(req: Request, res: Response) {
        let blocks = await pool.query('SELECT b.id_block, bt.name_block_type, b.block_number FROM blocks b INNER JOIN block_types bt ON bt.id_block_type = b.fk_id_block_type WHERE b.block_status != 0');
        res.status(200).json(blocks);
    }

    //brind data vehicle
    public async listVehicle(req: Request, res: Response) {
        let vehicle = await pool.query('SELECT v.vehicle_plate, u.document_number, u.first_name, u.surname FROM vehicles v INNER JOIN users u ON v.fk_document_number = u.document_number WHERE v.vehicle_status != 0');
        res.status(200).json(vehicle);
    }

}

export const globalController = new GlobalController();