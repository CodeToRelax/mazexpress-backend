"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const config_model_1 = __importDefault(require("../models/config.model"));
const shipments_model_1 = __importDefault(require("../models/shipments.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const helpers_1 = require("../utils/helpers");
const types_1 = require("../utils/types");
const mohammedMongoId = process.env.MOHAMMED_MONGO_ID;
const getShipments = async (paginationOptions, filters, user) => {
    let query = {};
    if (filters.searchParam) {
        const sanitizedSearchParam = (0, helpers_1.sanitizeSearchParam)(filters.searchParam);
        query.$or = [
            { isn: { $regex: sanitizedSearchParam, $options: 'i' } },
            { esn: { $regex: sanitizedSearchParam, $options: 'i' } },
            { csn: { $regex: sanitizedSearchParam, $options: 'i' } },
        ];
    }
    else {
        query = { ...filters };
    }
    if (filters.from || filters.to) {
        const createdAtFilter = {};
        if (filters.from)
            createdAtFilter.$gte = new Date(filters.from);
        if (filters.to)
            createdAtFilter.$lte = new Date(filters.to);
        query.createdAt = createdAtFilter;
        delete query.from;
        delete query.to;
    }
    const sortOptions = { createdAt: -1 };
    const shouldPaginate = paginationOptions.pagination !== false;
    try {
        const mongoUsers = await user_model_1.default.find({ _id: user?.mongoId });
        const mongoUser = mongoUsers[0];
        if (!mongoUser) {
            throw new Error('User not found in database');
        }
        const userCountry = mongoUser.address?.country;
        const userType = mongoUser.userType?.toLowerCase();
        if (user?.mongoId === mohammedMongoId) {
            if (shouldPaginate) {
                return await shipments_model_1.default.paginate(query, {
                    ...paginationOptions,
                    sort: sortOptions,
                });
            }
            else {
                return await shipments_model_1.default.find(query)
                    .sort(paginationOptions.sort || 'asc')
                    .lean();
            }
        }
        if (userType === types_1.UserTypes.CUSTOMER) {
            const finalFilters = {
                ...query,
                csn: mongoUser.uniqueShippingNumber,
            };
            if (shouldPaginate) {
                return await shipments_model_1.default.paginate(finalFilters, {
                    ...paginationOptions,
                    sort: sortOptions,
                });
            }
            else {
                return await shipments_model_1.default.find(finalFilters)
                    .sort(paginationOptions.sort || 'asc')
                    .lean();
            }
        }
        const adminStatuses = (0, helpers_1.getAdminStatusesForCountry)(userCountry);
        const adminFilters = {
            ...query,
            status: { $in: adminStatuses },
        };
        if (shouldPaginate) {
            return await shipments_model_1.default.paginate(adminFilters, {
                ...paginationOptions,
                sort: sortOptions,
            });
        }
        else {
            return await shipments_model_1.default.find(adminFilters)
                .sort(paginationOptions.sort || 'asc')
                .lean();
        }
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.getShipmentsError', 'errorMessageTemp', error);
    }
};
const getShipment = async (shipmentEsn) => {
    try {
        const user = shipments_model_1.default.findOne({ esn: shipmentEsn });
        return user;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.createShipmentError', 'errorMessageTemp', error);
    }
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
        const newShipmentSaveFile = await shipmentInstance.save();
        return newShipmentSaveFile;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.createShipmentError', 'errorMessageTemp', error);
    }
};
const updateShipment = async (_id, body, user) => {
    const adminUser = await user_model_1.default.find({ _id: user?.mongoId });
    if (user?.mongoId === mohammedMongoId) {
        const res = await shipments_model_1.default.findOneAndUpdate({ _id }, { ...body });
        return res;
    }
    (0, helpers_1.validateAdminCanDoByCountry)(adminUser[0], body.status);
    try {
        const res = await shipments_model_1.default.findOneAndUpdate({ _id }, { ...body });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.shipmentUpdateError', 'errorMessageTemp', error);
    }
};
const updateShipments = async (body, user) => {
    const admin = await user_model_1.default.find({ _id: user?.mongoId });
    if (user?.mongoId === mohammedMongoId) {
        const res = await shipments_model_1.default.updateMany({ _id: { $in: body.shipmentsId } }, { status: body.shipmentStatus });
        return res;
    }
    (0, helpers_1.validateAdminCanDoByCountry)(admin[0], body.shipmentStatus);
    try {
        const res = await shipments_model_1.default.updateMany({ _id: { $in: body.shipmentsId } }, { status: body.shipmentStatus });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
    }
};
const deleteShipment = async (body, user) => {
    const shipments = await shipments_model_1.default.find({ _id: { $in: body.shipmentsId } });
    const mongoUser = await user_model_1.default.find({ _id: user?.mongoId });
    const userCountry = mongoUser[0]?.address.country;
    if (user?.mongoId === mohammedMongoId) {
        const res = await shipments_model_1.default.deleteMany({ _id: { $in: body.shipmentsId } });
        return res;
    }
    for (const shipment of shipments) {
        if (!(0, helpers_1.checkAdminResponsibility)(userCountry, shipment.status)) {
            throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'unauthorized personnel', 'unauthorized personnel');
        }
    }
    try {
        const res = await shipments_model_1.default.deleteMany({ _id: { $in: body.shipmentsId } });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.shipmentDeleteError', 'errorMessageTemp', error);
    }
};
const calculateShippingPrice = async (body) => {
    const config = await config_model_1.default.findOneAndUpdate({ _id: '65db6c55d3a4d41e6ac96432' }, { ...body });
    if (!config?.shippingCost || !config?.libyanExchangeRate) {
        return 'Online Calculation is paused now';
    }
    const finalPrice = (0, helpers_1.calculateShippingPriceUtil)(body.shippingMethod, body.weight, body.dimensions, config?.shippingCost, config?.libyanExchangeRate);
    try {
        return finalPrice;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.shipmentDeleteError', 'errorMessageTemp', error);
    }
};
const updateShipmentsEsn = async (body, user) => {
    const mongoUser = await user_model_1.default.find({ _id: user?.mongoId });
    const userCountry = mongoUser[0]?.address.country;
    if (user?.mongoId === '6692c0d7888a7f31998c180e') {
        const res = await shipments_model_1.default.updateMany({ esn: { $in: body.shipmentsEsn } }, { status: body.shipmentStatus });
        return res;
    }
    if (!(0, helpers_1.checkAdminResponsibility)(userCountry, body.shipmentStatus)) {
        throw new error_middleware_1.CustomErrorHandler(403, 'unauthorized personnel', 'unauthorized personnel');
    }
    try {
        const res = await shipments_model_1.default.updateMany({ esn: { $in: body.shipmentsEsn } }, { status: body.shipmentStatus });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.shipmentUpdateError', 'errorMessageTemp', error);
    }
};
exports.ShipmentsController = {
    getShipments,
    getShipment,
    createShipment,
    updateShipment,
    updateShipments,
    updateShipmentsEsn,
    deleteShipment,
    calculateShippingPrice,
};
//# sourceMappingURL=shipments.controller.js.map