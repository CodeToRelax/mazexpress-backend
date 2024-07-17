"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const shipments_model_1 = __importDefault(require("../models/shipments.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const getShipmentCountByStatus = async () => {
    try {
        const results = await shipments_model_1.default.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        const response = {
            total: 0,
            receivedAtWarehouse: 0,
            shippedToDestination: 0,
            readyForPickUp: 0,
            delivered: 0,
        };
        results.forEach((result) => {
            response.total += result.count;
            switch (result._id) {
                case 'received at warehouse':
                    response.receivedAtWarehouse = result.count;
                    break;
                case 'shipped to destination':
                    response.shippedToDestination = result.count;
                    break;
                case 'ready for pick up':
                    response.readyForPickUp = result.count;
                    break;
                case 'delivered':
                    response.delivered = result.count;
                    break;
                default:
                    break;
            }
        });
        return response;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.configUpdateError', 'errorMessageTemp', error);
    }
};
const getUserAndShipmentCountPerYear = async (year) => {
    try {
        const result = {
            year,
            monthlyCounts: [],
        };
        for (let month = 0; month < 12; month++) {
            const startDate = new Date(Date.UTC(parseInt(year, 10), month, 1));
            const endDate = new Date(Date.UTC(parseInt(year, 10), month + 1, 0, 23, 59, 59, 999));
            const userCount = await user_model_1.default.countDocuments({
                createdAt: { $gte: startDate, $lt: endDate },
            });
            const shipmentCount = await shipments_model_1.default.countDocuments({
                createdAt: { $gte: startDate, $lt: endDate },
            });
            result.monthlyCounts.push({
                month: month + 1,
                userCount,
                shipmentCount,
            });
        }
        return result;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.configUpdateError', 'errorMessageTemp', error);
    }
};
exports.DashboardController = {
    getShipmentCountByStatus,
    getUserAndShipmentCountPerYear,
};
//# sourceMappingURL=dashboard.controller.js.map