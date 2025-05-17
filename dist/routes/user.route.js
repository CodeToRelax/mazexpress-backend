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
const user_validation_1 = require("../validation/user.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getAllUsers', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    const { page: _p, limit: _l, sort: _s, paginate, ...rawFilters } = req.query;
    const page = parseInt(_p, 10) || 1;
    const limit = parseInt(_l, 10) || 10;
    const sort = _s || 'asc';
    const paginationOptions = {
        page,
        limit,
        sort,
        pagination: !!paginate,
        lean: true,
    };
    const filters = rawFilters;
    const results = await user_controller_1.UserController.getAllUsers(paginationOptions, filters);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
});
router.get('/getAllUsersUnpaginated', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    const { page: _p, limit: _l, sort: _s, ...rawFilters } = req.query;
    const page = parseInt(_p, 10) || 1;
    const limit = parseInt(_l, 10) || 10;
    const sort = _s || 'asc';
    const paginationOptions = {
        page,
        limit,
        sort,
        pagination: false,
        lean: true,
    };
    const filters = rawFilters;
    const results = await user_controller_1.UserController.getAllUsers(paginationOptions, filters);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
});
router.get('/getUser/:id', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    if (!req.params.id)
        throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    const results = await user_controller_1.UserController.getUser(req.params.id);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
});
router.post('/createUser', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(auth_validation_1.createUserValidation), async (req, res) => {
    const user = await auth_controller_1.AuthController.createUser(req.body);
    return res.status(types_1.StatusCode.SUCCESS_CREATED).json(user);
});
router.patch('/toggleUser', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(auth_validation_1.toggleUserValidation), async (req, res) => {
    const results = await user_controller_1.UserController.toggleUser(req.body.firebaseId, req.body.status);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
});
router.patch('/updateUser/:id', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(user_validation_1.AdminUpdateUserValidation), async (req, res) => {
    if (!req.params.id)
        throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    const filter = { _id: req.params.id };
    const results = await user_controller_1.UserController.updateUser(filter, req.body);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
});
router.patch('/updateProfile', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(user_validation_1.UpdateProfileValidation), async (req, res) => {
    const results = await user_controller_1.UserController.updateUser({ _id: req.user?.mongoId }, req.body);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
});
router.delete('/deleteUser', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(user_validation_1.deleteUserValidation), async (req, res) => {
    const results = await user_controller_1.UserController.deleteUser(req.body.mongoId, req.body.firebaseId);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
});
exports.default = router;
//# sourceMappingURL=user.route.js.map