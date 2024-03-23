"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const shipments_model_1 = __importDefault(require("../models/shipments.model"));
const helpers_1 = require("../utils/helpers");
const getShipments = async () => {
    try {
        const shipments = await shipments_model_1.default.find({});
        return shipments;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.getShipmentsError', 'errorMessageTemp', error);
    }
};
const getShipment = async (shipmentEsn) => {
    const user = shipments_model_1.default.findOne({ esn: shipmentEsn });
    return user;
};
const createShipment = async (body) => {
    const newShipment = {
        ...body,
        esn: (0, helpers_1.generateExternalTrackingNumber)(),
    };
    try {
        const shipmentInstance = new shipments_model_1.default(newShipment);
        const newWarehouse = await shipmentInstance.save();
        return newWarehouse;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.createShipmentError', 'errorMessageTemp', error);
    }
};
const updateShipment = async (_id, body) => {
    try {
        const res = await shipments_model_1.default.findOneAndUpdate({ _id }, { ...body });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
    }
};
const deleteShipment = async (_id) => {
    try {
        const res = await shipments_model_1.default.findByIdAndDelete(_id);
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.shipmentDeleteError', 'errorMessageTemp', error);
    }
};
exports.ShipmentsController = {
    getShipments,
    getShipment,
    createShipment,
    updateShipment,
    deleteShipment,
};
//# sourceMappingURL=shipments.controller.js.map