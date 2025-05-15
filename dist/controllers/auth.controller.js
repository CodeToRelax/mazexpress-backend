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
const createUser = async (body) => {
    let fbUser = null;
    try {
        fbUser = await firebase_controller_1.FirebaseController.createFirebaseUser({
            email: body.email,
            password: body.password,
        });
        const mongoUserBody = new user_model_1.default({
            ...body,
            username: (0, helpers_1.generateRandomUsername)(),
            userType: body.userType,
            uniqueShippingNumber: (0, helpers_1.generateShippingNumber)(body.userType, body.address.city),
            acl: (0, helpers_1.generateAcl)(body.userType),
            firebaseId: fbUser.uid,
            disabled: fbUser.disabled,
        });
        const mongoUser = await mongoUserBody.save();
        await firebase_controller_1.FirebaseController.addFirebaseCustomClaims({
            uid: fbUser.uid,
            customClaims: { mongoId: mongoUser._id, role: body.userType },
        });
        return mongoUser;
    }
    catch (error) {
        console.log(error);
        if (fbUser) {
            try {
                await firebase_controller_1.FirebaseController.deleteFirebaseUser(fbUser.uid);
                console.warn(`Rolled back Firebase user: ${fbUser.uid}`);
            }
            catch (firebaseDeletionError) {
                console.error('Failed to rollback Firebase user:');
                console.error(firebaseDeletionError);
            }
        }
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            console.log(error);
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
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_UNAUTHORIZED, 'common.userUpdateError', 'Unable to update user access control list', error);
    }
};
exports.AuthController = {
    createUser,
    updateUserAcl,
};
//# sourceMappingURL=auth.controller.js.map