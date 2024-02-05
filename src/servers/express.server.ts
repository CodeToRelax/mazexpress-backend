import { ErrorMiddleware } from '@/middlewares/error.middleware';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import AuthRouter from '@/routes/auth.route';
import UserRouter from '@/routes/user.route';

const createExpressServer = () => {
  const App: Application = express();

  // request middlewares
  App.use(cors());
  App.use(bodyParser.json());
  App.use(bodyParser.urlencoded());
  App.use(express.json({ limit: '50mb' }));
  App.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

  App.get('/', (req, res) => {
    res.send(
      'Welcome to mazexpress backend architected and developed by monir shembesh 2024. All services are running with no issues!'
    );
  });
  App.use('/user', UserRouter);
  App.use('/auth', AuthRouter);

  // response middlewares
  App.use(ErrorMiddleware);

  // return server app
  return App;
};

export default createExpressServer;
