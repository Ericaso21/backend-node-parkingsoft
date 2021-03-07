import { Router } from 'express';

//import controller
import { vehicleController } from '../controllers/vehicleController';

class VehicleRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config():void {
        this.router.get('/list',vehicleController.list);
    }

}

const vehicleRoutes = new VehicleRoutes();
export default vehicleRoutes.router;