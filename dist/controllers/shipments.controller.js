"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const shipments_model_1 = __importDefault(require("../models/shipments.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const helpers_1 = require("../utils/helpers");
const getShipments = async (filters, paginationOptions) => {
    try {
        let query = {};
        if (filters.searchParam) {
            const sanitizedSearchParam = (0, helpers_1.sanitizeSearchParam)(filters.searchParam);
            query = {
                $or: [
                    { isn: { $regex: sanitizedSearchParam, $options: 'i' } },
                    { esn: { $regex: sanitizedSearchParam, $options: 'i' } },
                    { csn: { $regex: sanitizedSearchParam, $options: 'i' } },
                ],
            };
        }
        else {
            query = { ...filters };
        }
        if (filters.from || filters.to) {
            query.createdAt = {};
            if (filters.from) {
                const fromDate = new Date(filters.from);
                query.createdAt.$gte = fromDate;
            }
            if (filters.to) {
                const toDate = new Date(filters.to);
                query.createdAt.$lte = toDate;
            }
            delete query.from;
            delete query.to;
        }
        console.log(query);
        const shipments = await shipments_model_1.default.paginate(query, paginationOptions);
        return shipments;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.getShipmentsError', 'errorMessageTemp', error);
    }
};
const getShipmentsUnpaginated = async (filters) => {
    try {
        const shipments = await shipments_model_1.default.find(filters ? filters : {});
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
    const currentDate = new Date();
    const estimatedArrivalDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
    const newShipment = {
        ...body,
        isn: body.isn ? body.isn : '',
        esn: (0, helpers_1.generateExternalTrackingNumber)(),
        estimatedArrival: estimatedArrivalDate,
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
const updateShipment = async (_id, body, user) => {
    const shipment = await shipments_model_1.default.find({ _id });
    const mongoUser = await user_model_1.default.find({ _id: user?.mongoId });
    if (!(0, helpers_1.checkAdminResponsibility)(mongoUser[0]?.address.country, shipment[0].status))
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const res = await shipments_model_1.default.findOneAndUpdate({ _id }, { ...body });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
    }
};
const updateShipments = async (body, user) => {
    const shipments = await shipments_model_1.default.find({ _id: { $in: body.shipmentsId } });
    const mongoUser = await user_model_1.default.find({ _id: user?.mongoId });
    const userCountry = mongoUser[0]?.address.country;
    for (const shipment of shipments) {
        if (!(0, helpers_1.checkAdminResponsibility)(userCountry, shipment.status)) {
            throw new error_middleware_1.CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
        }
    }
    try {
        const res = await shipments_model_1.default.updateMany({ _id: { $in: body.shipmentsId } }, { status: body.shipmentStatus });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
    }
};
const deleteShipment = async (_id, user) => {
    const shipment = await shipments_model_1.default.find({ _id });
    const mongoUser = await user_model_1.default.find({ _id: user?.mongoId });
    if (!(0, helpers_1.checkAdminResponsibility)(mongoUser[0]?.address.country, shipment[0].status))
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
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
    updateShipments,
    deleteShipment,
    getShipmentsUnpaginated,
};
//# sourceMappingURL=shipments.controller.js.map