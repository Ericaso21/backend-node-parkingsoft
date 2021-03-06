import { Router } from "express";

//import controller
import { billController } from "../controllers/billsController";

class BillRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/ticket/:id", billController.getTicket);
    this.router.post("/create", billController.create);
    this.router.get("/list", billController.getBill);
    this.router.delete("/delete/:id", billController.deleteBill);
  }
}

const billRoutes = new BillRoutes();
export default billRoutes.router;
