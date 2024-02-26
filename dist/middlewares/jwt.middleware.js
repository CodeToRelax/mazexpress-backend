"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_server_1 = require("../servers/firebase.server");
const AuthenticateFbJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const idToken = authHeader.split(' ')[1];
        try {
            await firebase_server_1.fbAuth.verifyIdToken(idToken);
            return next();
        }
        catch (error) {
            console.log(error);
            return res.sendStatus(403);
        }
    }
    else {
        res.sendStatus(401);
    }
};
exports.default = AuthenticateFbJWT;
//# sourceMappingURL=jwt.middleware.js.map