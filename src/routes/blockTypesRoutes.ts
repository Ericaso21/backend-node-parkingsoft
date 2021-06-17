import { Router } from "express";

//import controller
import { blockTypesController } from "../controllers/blockTypesControllers";

class BlockTypesRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/list", blockTypesController.list);
    this.router.get("/getOne/:id", blockTypesController.getOne);
    this.router.post("/create", blockTypesController.create);
    this.router.put("/update/:id", blockTypesController.update);
    this.router.delete("/delete/:id", blockTypesController.delete);
  }
}

const blockTypesRoutes = new BlockTypesRoutes();
export default blockTypesRoutes.router;
