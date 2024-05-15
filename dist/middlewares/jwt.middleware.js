"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const user_model_1 = __importDefault(require("../models/user.model"));
const AuthenticateFbJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const idToken = authHeader.split(' ')[1];
        try {
            const decodedToken = await __1.fbAuth.verifyIdToken(idToken);
            const mongoUser = await user_model_1.default.findById({ _id: decodedToken.mongoId });
            req.user = decodedToken;
            req.user.acl = mongoUser.acl;
            return next();
        }
        catch (error) {
            return res.sendStatus(403);
        }
    }
    else {
        res.sendStatus(401);
    }
};
exports.default = AuthenticateFbJWT;
//# sourceMappingURL=jwt.middleware.js.map