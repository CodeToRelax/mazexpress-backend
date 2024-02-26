import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import morganBody from 'morgan-body';
import ConnectToMongoDB from '@/servers/mongoose.server';
import createExpressServer from './servers/express.server';
import * as Firebase from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
// eslint-disable-next-line @typescript-eslint/no-var-requires

const Env = dotenv.config({ path: '.env' });
dotenvExpand.expand(Env);

// --- FB connection --- //
const serviceKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

const App = Firebase.initializeApp({
  credential: Firebase.credential.cert(serviceKey),
  projectId: process.env.FIREBASE_PROJECT_ID,
});
export const fbAuth = getAuth(App);

// --- DB connection --- //
const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@main.ybp56ng.mongodb.net/`;
ConnectToMongoDB(DB_URI);
// --- server connection --- //
const port = process.env.PORT ? process.env.PORT : 3002;
const server = createExpressServer();
morganBody(server);

// listen to port
server.listen(port, () => console.log('Server is running on', port));
