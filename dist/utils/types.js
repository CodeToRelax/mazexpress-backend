"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypes = void 0;
var UserTypes;
(function (UserTypes) {
    UserTypes["ADMIN"] = "admin";
    UserTypes["CUSTOMER"] = "customer";
})(UserTypes || (exports.UserTypes = UserTypes = {}));
const systemServices = ['auth', 'user', 'warehouse'];
const getEndpoints = [];
const postEndpoints = ['/auth/signUp'];
const updateEndpoints = [];
const deleteEndpoints = [];
//# sourceMappingURL=types.js.map