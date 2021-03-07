import { Router } from 'express';

//import controller
import { ratesController } from '../controllers/ratesController';

class RatesRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config():void {
        this.router.get('/list',ratesController.list);
        this.router.get('/getOne/:id',ratesController.getOne);
        this.router.post('/create',ratesController.create);
    }

}

const ratesRoutes = new RatesRoutes();
export default ratesRoutes.router;