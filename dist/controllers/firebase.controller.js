"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const firebase_server_1 = require("../servers/firebase.server");
const createFirebaseUser = async (body) => {
    try {
        return await firebase_server_1.fbAuth.createUser({
            email: body.email,
            password: body.password,
        });
    }
    catch (error) {
        const err = error;
        throw new error_middleware_1.CustomErrorHandler(403, err.code, err.message, error);
    }
};
const resetFirebaseUserPassword = async (body) => {
    try {
        await firebase_server_1.fbAuth.updateUser(body.firebaseUid, {
            password: body.newPassword,
        });
        return `password reset successfully`;
    }
    catch (error) {
        console.log(error);
        return 'error';
    }
};
const toggleFirebaseUser = async (body) => {
    try {
        await firebase_server_1.fbAuth.updateUser(body.firebaseId, {
            disabled: body.status === 'disable' ? true : false,
        });
        return `user ${body.status}`;
    }
    catch (error) {
        const err = error;
        throw new error_middleware_1.CustomErrorHandler(403, err.code, err.message, error);
    }
};
const addFirebaseCustomClaims = async (body) => {
    try {
        return await firebase_server_1.fbAuth.setCustomUserClaims(body.uid, body.customClaims);
    }
    catch (error) {
        const err = error;
        throw new error_middleware_1.CustomErrorHandler(403, 'common.addUserAttributeError', err.message, error);
    }
};
const deleteFirebaseUser = async (fbId) => {
    try {
        return await firebase_server_1.fbAuth.deleteUser(fbId);
    }
    catch (error) {
        const err = error;
        throw new error_middleware_1.CustomErrorHandler(403, err.code, err.message, error);
    }
};
exports.FirebaseController = {
    createFirebaseUser,
    resetFirebaseUserPassword,
    toggleFirebaseUser,
    addFirebaseCustomClaims,
    deleteFirebaseUser,
};
//# sourceMappingURL=firebase.controller.js.map