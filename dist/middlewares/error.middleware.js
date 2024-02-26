"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = exports.CustomErrorHandler = void 0;
class CustomErrorHandler extends Error {
    constructor(statusCode, errorCode, errorDescription, rawError, ...params) {
        super(...params);
        this.statusCode = statusCode;
        this.name = errorCode;
        this.message = errorDescription;
        this.rawError = rawError;
    }
}
exports.CustomErrorHandler = CustomErrorHandler;
const ErrorMiddleware = (error, _req, res, _next) => {
    return res.status(error.statusCode).json(error);
};
exports.ErrorMiddleware = ErrorMiddleware;
//# sourceMappingURL=error.middleware.js.map