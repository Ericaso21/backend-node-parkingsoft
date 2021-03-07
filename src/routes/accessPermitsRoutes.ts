import { Router } from 'express';

//import controller
import { accessPermitsController } from '../controllers/accessPermitsController';

class AccessPermitsRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config():void {
        this.router.get('/list',accessPermitsController.list);
        this.router.get('/getOne/:id',accessPermitsController.getOne);
        this.router.post('/create',accessPermitsController.create);
        this.router.put('/update/:id',accessPermitsController.update);
        this.router.delete('/delete/:id',accessPermitsController.delete);
    }

}

const accessPermitsRoutes = new AccessPermitsRoutes();
export default accessPermitsRoutes.router;