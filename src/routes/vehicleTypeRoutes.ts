import { Router } from 'express';

//import controller
import { vehicleTypeController } from '../controllers/vehicleTypeController';

class VehicleTypeRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config():void {
        this.router.get('/list',vehicleTypeController.list);
        this.router.get('/getOne/:id',vehicleTypeController.getOne);
        this.router.post('/create',vehicleTypeController.create);
        this.router.put('/update/:id',vehicleTypeController.update);
        this.router.delete('/delete/:id',vehicleTypeController.delete);
    }

}

const vehicleTypeRoutes = new VehicleTypeRoutes();
export default vehicleTypeRoutes.router;