"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const types_1 = require("../utils/types");
const firebase_controller_1 = require("./firebase.controller");
const user_model_1 = __importDefault(require("../models/user.model"));
const helpers_1 = require("../utils/helpers");
const error_middleware_1 = require("../middlewares/error.middleware");
const createUser = async (body, customerType) => {
    try {
        const fbUser = await firebase_controller_1.FirebaseController.createFirebaseUser({
            email: body.email,
            password: body.password,
        });
        const mongoUserBody = new user_model_1.default({
            ...body,
            address: {
                ...body.address,
                country: customerType === types_1.UserTypes.CUSTOMER ? types_1.Countries.LIBYA : body.address.country,
            },
            username: (0, helpers_1.generateRandomUsername)(),
            userType: customerType,
            uniqueShippingNumber: (0, helpers_1.generateShippingNumber)(customerType, body.address.city),
            acl: JSON.stringify((0, helpers_1.generateAcl)(customerType)),
            firebaseId: fbUser.uid,
            disabled: fbUser.disabled,
        });
        const mongoUser = await mongoUserBody.save();
        await firebase_controller_1.FirebaseController.addFirebaseCustomClaims({
            uid: fbUser.uid,
            customClaims: { mongoId: mongoUser._id },
        });
        return mongoUser;
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
const updateUserAcl = async (_id, body) => {
    try {
        const res = await user_model_1.default.findOneAndUpdate({ _id }, { acl: body });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.userUpdateError', 'errorMessageTemp', error);
    }
};
exports.AuthController = {
    createUser,
    updateUserAcl,
};
//# sourceMappingURL=auth.controller.js.map