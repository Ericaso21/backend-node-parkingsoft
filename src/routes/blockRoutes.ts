import { Router } from 'express';

//import controller
import { blockController } from '../controllers/blockController';

class BlockRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config():void {
        this.router.get('/list',blockController.list);
        this.router.get('/getOne/:id',blockController.getOne);
        this.router.post('/create',blockController.create);
        this.router.put('/update/:id',blockController.update);
        this.router.delete('/delete/:id',blockController.delete);
    }

}

const blockRoutes = new BlockRoutes();
export default blockRoutes.router;