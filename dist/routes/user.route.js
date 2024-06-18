"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const user_controller_1 = require("../controllers/user.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
const jwt_middleware_1 = __importDefault(require("../middlewares/jwt.middleware"));
const helpers_1 = require("../utils/helpers");
const auth_validation_1 = require("../validation/auth.validation");
const user_validation_1 = require("../validation/user.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getAllUsers', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    const { page } = req.query;
    try {
        const paginationOptions = {
            page: parseInt(page, 10) || 1,
            limit: 10,
        };
        const filters = { ...req.query };
        delete filters.page;
        delete filters.sort;
        delete filters.limit;
        const results = await user_controller_1.UserController.getAllUsers(paginationOptions, filters);
        return res.status(200).json(results);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.get('/getAllUsersUnpaginated', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const results = await user_controller_1.UserController.getAllUsersUnpaginated();
        return res.status(200).json(results);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.get('/getUser/:id', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    if (!req.params.id)
        throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    try {
        const results = await user_controller_1.UserController.getUser(req.params.id);
        return res.status(200).json(results);
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(404, 'common.error', 'common.userNotFound', error);
    }
});
router.post('/createUser', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const { error } = auth_validation_1.createUserValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        const user = await auth_controller_1.AuthController.createUser(req.body, req.body.userType);
        return res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.patch('/toggleUser', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const { error } = auth_validation_1.toggleUserValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        const results = await user_controller_1.UserController.toggleUser(req.body.firebaseId, req.body.status);
        return res.status(200).json(results);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.patch('/updateUser/:id', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    if (!req.params.id)
        throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    try {
        const { error } = user_validation_1.AdminUpdateUserValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        const filter = { _id: req.params.id };
        const results = await user_controller_1.UserController.updateUser(filter, req.body);
        return res.status(200).json(results);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.patch('/updateProfile', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const { error } = user_validation_1.UpdateProfileValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        const results = await user_controller_1.UserController.updateUser({ _id: req.user?.mongoId }, req.body);
        return res.status(200).json(results);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.delete('/deleteUser', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const { error } = user_validation_1.deleteUserValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        const results = await user_controller_1.UserController.deleteUser(req.body.mongoId, req.body.firebaseId);
        return res.status(200).json(results);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
exports.default = router;
//# sourceMappingURL=user.route.js.map