"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const user_controller_1 = require("../controllers/user.controller");
const checkUserRules_middleware_1 = require("../middlewares/checkUserRules.middleware");
const error_middleware_1 = require("../middlewares/error.middleware");
const jwt_middleware_1 = __importDefault(require("../middlewares/jwt.middleware"));
const validateRequest_middleware_1 = require("../middlewares/validateRequest.middleware");
const types_1 = require("../utils/types");
const auth_validation_1 = require("../validation/auth.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.post('/signUp', (0, validateRequest_middleware_1.ValidateRequest)(auth_validation_1.createUserValidation), async (req, res) => {
    try {
        const user = await auth_controller_1.AuthController.createUser(req.body);
        return res.status(types_1.StatusCode.SUCCESS_CREATED).json(user);
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.get('/acl/:id', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        const user = await user_controller_1.UserController.getUser(req.params.id);
        return res.status(types_1.StatusCode.SUCCESS_OK).json(user?.acl);
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.patch('/acl', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(auth_validation_1.createUserValidation), async (req, res) => {
    try {
        const user = await auth_controller_1.AuthController.updateUserAcl(req.body.userId, req.body.rules);
        return res.status(200).json(user?.acl);
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.route.js.map