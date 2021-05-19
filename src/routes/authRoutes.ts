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
    this.router.put("/userResetPassword", authController.resetPassword);
    this.router.put("/newPassword", authController.newPassword);
  }
}

const authRoutes = new AuthRoutes();
export default authRoutes.router;
