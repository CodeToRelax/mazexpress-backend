"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_1 = require("../middlewares/error.middleware");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require("express-async-errors");
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const warehouse_route_1 = __importDefault(require("../routes/warehouse.route"));
const shipments_route_1 = __importDefault(require("../routes/shipments.route"));
const config_route_1 = __importDefault(require("../routes/config.route"));
const dashboard_route_1 = __importDefault(require("../routes/dashboard.route"));
const createExpressServer = () => {
    const App = (0, express_1.default)();
    console.log('test');
    App.use((0, cors_1.default)());
    App.use(body_parser_1.default.json());
    App.use(body_parser_1.default.urlencoded());
    App.use(express_1.default.json({ limit: '50mb' }));
    App.use((0, morgan_1.default)(':method :url :status :response-time ms - :res[content-length]'));
    App.get('/', (req, res) => {
        res.send('Welcome to mazexpress backend architected and developed by monir shembesh 2024. All services are running with no issues!');
    });
    App.use('/auth', auth_route_1.default);
    App.use('/user', user_route_1.default);
    App.use('/warehouse', warehouse_route_1.default);
    App.use('/shipments', shipments_route_1.default);
    App.use('/config', config_route_1.default);
    App.use('/dashboard', dashboard_route_1.default);
    App.use(error_middleware_1.ErrorMiddleware);
    return App;
};
exports.default = createExpressServer;
//# sourceMappingURL=express.server.js.map