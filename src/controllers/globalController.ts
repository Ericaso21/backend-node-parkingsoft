import {Request, Response} from 'express';
import pool from '../database';

class GlobalController {

    // bring data document_types database 
    public async listDocumentType (req: Request, res: Response) {
        let document_types = await pool.query('SELECT id_document_type, document_type_name FROM document_types WHERE statu_type_acronym != 0');
        res.status(200).json(document_types);
    }

    //brind data roles database
    public async listRoles (req: Request, res: Response){
        let role = await pool.query('SELECT id_roles, name_role FROM roles WHERE role_status != 0');
        res.status(200).json(role);
    }

    //brind data gender database
    public async listGender (req: Request, res: Response){
        let genders = await pool.query('SELECT id_gender, name_gender, gender_acronym FROM genders WHERE gender_status != 0');
        res.status(200).json(genders);
    }

    //brind data modules database
    public async listModules (req: Request, res: Response){
        let modules = await pool.query('SELECT id_modules, name_modules FROM modules WHERE status_module != 0');
        res.status(200).json(modules);
    }
    // brind data user database+
    public async listUser (req: Request, res: Response){
        let users = await pool.query('SELECT u.document_number, u.pk_fk_id_document_type, u.first_name, u.second_name, u.surname, u.second_surname FROM users u INNER JOIN roles_users rol ON u.document_number = rl.pk_fk_document_number WHERE rl.pk_fk_id_roles = 3');
        res.status(200).json(users);
    }
    // bridn data vehicle types
    public async listVehicleTypes (req: Request, res: Response){
        let vehicleTypes = await pool.query('SELECT id_vehicle_type, vehicle_name FROM vehicle_types WHERE status_vehicle !=0');
        res.status(200).json(vehicleTypes);
    }
}

export const globalController = new GlobalController();