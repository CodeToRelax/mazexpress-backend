"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const morgan_body_1 = __importDefault(require("morgan-body"));
const mongoose_server_1 = __importDefault(require("./servers/mongoose.server"));
const express_server_1 = __importDefault(require("./servers/express.server"));
const Env = dotenv_1.default.config();
dotenv_expand_1.default.expand(Env);
const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@main.ybp56ng.mongodb.net/`;
(0, mongoose_server_1.default)(DB_URI);
const port = process.env.PORT ? process.env.PORT : 3002;
const server = (0, express_server_1.default)();
(0, morgan_body_1.default)(server);
server.listen(port, () => console.log('Server is running on', port));
//# sourceMappingURL=index.js.map