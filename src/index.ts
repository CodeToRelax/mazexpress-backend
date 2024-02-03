import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import morganBody from 'morgan-body';
import 'express-async-errors';
import ConnectToMongoDB from '@/servers/mongoose.server';
import createExpressServer from './servers/express.server';

const Env = dotenv.config();
dotenvExpand.expand(Env);

// --- DB connection --- //
ConnectToMongoDB(process.env.DB_URI as string);
// --- server connection --- //
const port = process.env.PORT ? process.env.PORT : 3002;
const server = createExpressServer();
morganBody(server);
server.listen(port, () => console.log('Server is running on', port));
