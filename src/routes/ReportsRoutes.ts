import { Router } from "express";

//import controller
import { reportController } from "../controllers/reportController";

class ReportRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/list", reportController.list);
  }
}

const reportRoutes = new ReportRoutes();
export default reportRoutes.router;
