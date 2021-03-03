import express,{ Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import methdOverride from 'method-override';
import bodyParser from 'body-parser';
import helmet from 'helmet';

//import routes
import healthRoutes from './routes/healthRoutes';
import authController from './routes/authRoutes';
import roleshRoutes from './routes/rolesRoutes';

//middelware
import RecaptchaMiddelware from './middleware/recaptchaMiddelware';

class Server { 

    public app: Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }
    //config express
    config():void{
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(methdOverride());
        this.app.use(helmet());
        this.app.disable('x-powered-by');
    }
    //routes api
    routes():void{
        //route health check status 200 and healthy
        this.app.use('/health',RecaptchaMiddelware,healthRoutes);
        this.app.use('/api/authentication',RecaptchaMiddelware,authController);
        this.app.use('/api/roles',roleshRoutes);

    }

    start():void{
        this.app.listen(this.app.get('port'), () =>{
            console.log('Server on port ', this.app.get('port'))
        });
    }

}

const server = new Server();
server.start();