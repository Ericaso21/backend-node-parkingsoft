import { Router } from "express";

//import controller
import { vehicleController } from "../controllers/vehicleController";

class VehicleRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/list", vehicleController.list);
    this.router.get("/getOne/:id", vehicleController.getOne);
    this.router.post("/create", vehicleController.create);
    this.router.put("/update/:id", vehicleController.update);
    this.router.delete("/delete/:id", vehicleController.delete);
  }
}

const vehicleRoutes = new VehicleRoutes();
export default vehicleRoutes.router;
