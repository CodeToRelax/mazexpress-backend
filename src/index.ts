import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import ConnectToMongoDB from '@/config/mongoose.config';
import UserRouter from '@/routes/user/user.route';
import * as swaggerUi from 'swagger-ui-express';
import apiDocs from '../swagger-output.json';

const Env = dotenv.config();
dotenvExpand.expand(Env);
const App: Application = express();

// middlewares //
// --- http --- //
App.use(cors());
// --- req/res config --- //
App.use(bodyParser.json());
App.use(bodyParser.urlencoded());
App.use(express.json({ limit: '50mb' }));
// --- logging --- //
App.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
morganBody(App);
// --- DB connection --- //
ConnectToMongoDB(process.env.DB_URI as string);
// --- routes --- //
App.get('/', (req, res) => {
  res.send(
    'Welcome to mazexpress backend architected and developed by monir shembesh 2024. All services are running with no issues!'
  );
});
App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocs));
App.use('/user', UserRouter);

// server
const port = process.env.PORT ? process.env.PORT : 3000;
App.listen(port, () => console.log('Server is running on', port));
