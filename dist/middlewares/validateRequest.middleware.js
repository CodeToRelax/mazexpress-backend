"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateRequest = void 0;
const types_1 = require("../utils/types");
const ValidateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST).json({
                message: 'Validation failed',
                details: error.details.map((d) => d.message),
            });
        }
        req.body = value;
        next();
        return;
    };
};
exports.ValidateRequest = ValidateRequest;
//# sourceMappingURL=validateRequest.middleware.js.map