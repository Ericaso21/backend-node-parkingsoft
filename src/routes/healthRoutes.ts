import { Router } from "express";

//import controller
import { healthController } from "../controllers/healthController";

class HealthRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/", healthController.health);
  }
}

const healthRoutes = new HealthRoutes();
export default healthRoutes.router;
