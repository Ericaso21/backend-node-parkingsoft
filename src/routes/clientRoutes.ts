import { Router } from "express";

//import controller
import { clientController } from "../controllers/clientController";

class ClientRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post("/vehicles", clientController.getVehiciclesUser);
    this.router.get("/plateVehicle/:id", clientController.getVehicle);
    this.router.put("/updateVehicle/:id", clientController.update);
    this.router.post(
      "/updateImageVehicle/:id",
      clientController.updateImageVehicle
    );
  }
}

const clientRoutes = new ClientRoutes();
export default clientRoutes.router;
