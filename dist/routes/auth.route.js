"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
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
exports.default = router;
//# sourceMappingURL=auth.route.js.map