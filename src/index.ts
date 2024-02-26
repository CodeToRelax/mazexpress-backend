import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import morganBody from 'morgan-body';
import ConnectToMongoDB from '@/servers/mongoose.server';
import createExpressServer from './servers/express.server';

const Env = dotenv.config();
dotenvExpand.expand(Env);

// --- DB connection --- //
const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@main.ybp56ng.mongodb.net/`;
ConnectToMongoDB(DB_URI);
// --- server connection --- //
const port = process.env.PORT ? process.env.PORT : 3002;
const server = createExpressServer();
morganBody(server);

// listen to port
server.listen(port, () => console.log('Server is running on', port));
