"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckUserRules = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const helpers_1 = require("../utils/helpers");
const types_1 = require("../utils/types");
const CheckUserRules = async (req, res, next) => {
    try {
        const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
        if (!hasValidRules) {
            return next(new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_UNAUTHORIZED, 'unauthorised_personnel', 'Unauthorized access'));
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.CheckUserRules = CheckUserRules;
//# sourceMappingURL=checkUserRules.middleware.js.map