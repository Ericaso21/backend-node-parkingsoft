import { Router } from "express";

//import controller
import { userController } from "../controllers/userController";

class UserRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/list", userController.list);
    this.router.get("/profile/:id", userController.userProfile);
    this.router.put("/updateProfile/:id", userController.updateUserProfile);
    this.router.post(
      "/updateProfileImage/:id",
      userController.updateProfileImage
    );
    this.router.post("/userData", userController.getUserData);
    this.router.get("/getOne/:id", userController.getOne);
    this.router.post("/create", userController.create);
    this.router.put("/update/:id", userController.update);
    this.router.delete("/delete/:id", userController.delete);
  }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;
