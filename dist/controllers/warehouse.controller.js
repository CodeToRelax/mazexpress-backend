"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const warehouse_model_1 = __importDefault(require("../models/warehouse.model"));
const getWarehouses = async () => {
    try {
        const warehouses = await warehouse_model_1.default.find({});
        return warehouses;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.getWarehouseError', 'errorMessageTemp', error);
    }
};
const createWarehouse = async (body) => {
    try {
        const warehouseInstance = new warehouse_model_1.default(body);
        const newWarehouse = await warehouseInstance.save();
        return newWarehouse;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.createWarehouseError', 'errorMessageTemp', error);
    }
};
const updateWarehouse = async (_id, body) => {
    try {
        const res = await warehouse_model_1.default.findOneAndUpdate({ _id }, { ...body });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.warehouseUpdateError', 'errorMessageTemp', error);
    }
};
const deleteWarehouse = async (_id) => {
    try {
        const res = await warehouse_model_1.default.findByIdAndDelete(_id);
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.warehouseUpdateError', 'errorMessageTemp', error);
    }
};
exports.WarehouseController = {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
};
//# sourceMappingURL=warehouse.controller.js.map