import { Router } from 'express';

//import controller
import { globalController } from '../controllers/globalController';

class GlobalRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config():void {
        this.router.get('/document_types', globalController.listDocumentType);
        this.router.get('/role',globalController.listRoles);
        this.router.get('/genders',globalController.listGender);
        this.router.get('/modules',globalController.listModules);
        this.router.get('/user',globalController.listUser);
        this.router.get('/vehicleType',globalController.listVehicleTypes);
        this.router.get('/blockTypes',globalController.listBlockTypes);
        this.router.get('/blocks',globalController.listBlock);
    }

}

const globalRoutes = new GlobalRoutes();
export default globalRoutes.router;