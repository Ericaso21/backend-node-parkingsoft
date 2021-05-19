import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import methdOverride from "method-override";
import bodyParser from "body-parser";
import helmet from "helmet";
import fileUpload from "express-fileupload";

//import routes
import healthRoutes from "./routes/healthRoutes";
import authController from "./routes/authRoutes";
import roleshRoutes from "./routes/rolesRoutes";
import globalRoutes from "./routes/globalRoutes";
import accessPermitsRoutes from "./routes/accessPermitsRoutes";
import userRoutes from "./routes/userRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import vehicleTypeRoutes from "./routes/vehicleTypeRoutes";
import ratesRoutes from "./routes/ratesRoutes";
import blockTypesRoutes from "./routes/blockTypesRoutes";
import blockRoutes from "./routes/blockRoutes";
import ticketsRoutes from "./routes/ticketsRoutes";
import billRoutes from "./routes/billRoutes";
import clientRoutes from "./routes/clientRoutes";
//middelware
import RecaptchaMiddelware from "./middleware/recaptchaMiddelware";

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }
  //config express
  config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(fileUpload());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(methdOverride());
    this.app.use(helmet());
    this.app.disable("x-powered-by");
  }
  //routes api
  routes(): void {
    //route health check status 200 and healthy
    this.app.use("/api/public", express.static("public"));
    this.app.use("/health", healthRoutes);
    this.app.use("/api/authentication", RecaptchaMiddelware, authController);
    this.app.use("/api/roles", RecaptchaMiddelware, roleshRoutes);
    this.app.use("/api/global", RecaptchaMiddelware, globalRoutes);
    this.app.use(
      "/api/accessPermits",
      RecaptchaMiddelware,
      accessPermitsRoutes
    );
    this.app.use("/api/user", RecaptchaMiddelware, userRoutes);
    this.app.use("/api/vehicles", RecaptchaMiddelware, vehicleRoutes);
    this.app.use("/api/vehicleTypes", RecaptchaMiddelware, vehicleTypeRoutes);
    this.app.use("/api/rates", RecaptchaMiddelware, ratesRoutes);
    this.app.use("/api/blockTypes", RecaptchaMiddelware, blockTypesRoutes);
    this.app.use("/api/block", RecaptchaMiddelware, blockRoutes);
    this.app.use("/api/tickets", RecaptchaMiddelware, ticketsRoutes);
    this.app.use("/api/bill", RecaptchaMiddelware, billRoutes);
    this.app.use("/api/client", RecaptchaMiddelware, clientRoutes);
  }

  start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port ", this.app.get("port"));
    });
  }
}

const server = new Server();
server.start();
