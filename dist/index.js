"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fbAuth = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const morgan_body_1 = __importDefault(require("morgan-body"));
const mongoose_server_1 = __importDefault(require("./servers/mongoose.server"));
const express_server_1 = __importDefault(require("./servers/express.server"));
const Firebase = __importStar(require("firebase-admin"));
const auth_1 = require("firebase-admin/auth");
const Env = dotenv_1.default.config({ path: '.env' });
dotenv_expand_1.default.expand(Env);
const serviceKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const App = Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceKey),
    projectId: process.env.FIREBASE_PROJECT_ID,
});
exports.fbAuth = (0, auth_1.getAuth)(App);
const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@main.ybp56ng.mongodb.net/`;
(0, mongoose_server_1.default)(DB_URI);
const port = process.env.PORT ? process.env.PORT : 3002;
const server = (0, express_server_1.default)();
(0, morgan_body_1.default)(server);
server.listen(port, () => console.log('Server is running on', port));
//# sourceMappingURL=index.js.map