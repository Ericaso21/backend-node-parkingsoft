import { Router } from 'express';

//import controller
import { ticketsController } from '../controllers/ticketsController';

class TicketsRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config():void {
        this.router.get('/list',ticketsController.list);
        this.router.get('/getOne/:id',ticketsController.getOne);
        this.router.post('/create',ticketsController.create);
        this.router.put('/update/:id',ticketsController.update);
        this.router.delete('/delete/:id',ticketsController.delete);
    }

}

const ticketsRoutes = new TicketsRoutes();
export default ticketsRoutes.router;