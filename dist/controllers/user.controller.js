"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const user_model_1 = __importDefault(require("../models/user.model"));
const firebase_controller_1 = require("./firebase.controller");
const helpers_1 = require("../utils/helpers");
const getUser = async (_id) => {
    const user = user_model_1.default.findById({ _id });
    return user;
};
const getAllUsers = async (paginationOtpions, filters) => {
    if (filters.searchParam) {
        let query = {};
        if (filters.searchParam) {
            const sanitizedSearchParam = (0, helpers_1.sanitizeSearchParam)(filters.searchParam);
            query = {
                $or: [
                    { email: { $regex: sanitizedSearchParam, $options: 'i' } },
                    { firstName: { $regex: sanitizedSearchParam, $options: 'i' } },
                    { lastName: { $regex: sanitizedSearchParam, $options: 'i' } },
                    { uniqueShippingNumber: { $regex: sanitizedSearchParam, $options: 'i' } },
                    { phoneNumber: { $regex: sanitizedSearchParam, $options: 'i' } },
                ],
            };
        }
        else {
            query = filters;
        }
        const users = await user_model_1.default.paginate(query, paginationOtpions);
        return users;
    }
    const users = await user_model_1.default.paginate(filters, paginationOtpions);
    return users;
};
const updateUser = async (filter, body) => {
    try {
        const res = await user_model_1.default.findOneAndUpdate(filter, { ...body });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.userUpdateError', 'errorMessageTemp', error);
    }
};
const deleteUser = async (_id, fbId) => {
    try {
        await firebase_controller_1.FirebaseController.deleteFirebaseUser(fbId);
        const deletedUser = await user_model_1.default.deleteOne({ _id });
        return deletedUser;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            console.log(error);
            console.error('MongoDB error occurred:');
            throw error;
        }
    }
};
const toggleUser = async (firebaseId, status) => {
    const filter = { firebaseId };
    try {
        await firebase_controller_1.FirebaseController.toggleFirebaseUser({
            firebaseId,
            status,
        });
        await updateUser(filter, {
            disabled: status === 'disable' ? true : false,
        });
        return `user ${status} success`;
    }
    catch (error) {
        throw error;
    }
};
exports.UserController = {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    toggleUser,
};
//# sourceMappingURL=user.controller.js.map