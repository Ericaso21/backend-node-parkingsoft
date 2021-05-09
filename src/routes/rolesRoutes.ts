import { Router } from "express";

//import controller
import { rolesController } from "../controllers/rolesControllers";

class RoleshRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/list", rolesController.list);
    this.router.get("/getOne/:id", rolesController.getOne);
    this.router.post("/create", rolesController.create);
    this.router.put("/update/:id", rolesController.update);
    this.router.delete("/delete/:id", rolesController.delete);
  }
}

const roleshRoutes = new RoleshRoutes();
export default roleshRoutes.router;
