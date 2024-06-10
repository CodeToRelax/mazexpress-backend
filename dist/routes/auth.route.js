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
const types_1 = require("../utils/types");
const auth_validation_1 = require("../validation/auth.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.post('/signUp', async (req, res) => {
    try {
        const { error } = auth_validation_1.signupValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        const user = await auth_controller_1.AuthController.createUser(req.body, types_1.UserTypes.CUSTOMER);
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
router.get('/acl/:id', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const user = await user_controller_1.UserController.getUser(req.params.id);
        return res.status(200).json(user?.acl);
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
router.patch('/acl', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const { error } = auth_validation_1.updateAclValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        const user = await auth_controller_1.AuthController.updateUserAcl(req.body.userId, req.body.rules);
        return res.status(200).json(user?.acl);
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
//# sourceMappingURL=auth.route.js.map