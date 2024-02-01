import * as Firebase from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceKey = require('../../firebase-admin-key.json');

const App = Firebase.initializeApp({
  credential: Firebase.credential.cert(serviceKey),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export const fbAuth = getAuth(App);
