import { Router } from "express";

//import controller
import { authController } from "../controllers/authController";

class AuthRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post("/create", authController.create);
    this.router.post("/user/authentication", authController.authentication);
  }
}

const authRoutes = new AuthRoutes();
export default authRoutes.router;
