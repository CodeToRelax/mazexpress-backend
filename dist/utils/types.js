"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypes = exports.Countries = exports.Cities = void 0;
var Cities;
(function (Cities) {
    Cities["BENGHAZI"] = "benghazi";
    Cities["ISTANBUL"] = "istanbul";
    Cities["TRIPOLI"] = "tripoli";
    Cities["MUSRATA"] = "musrata";
})(Cities || (exports.Cities = Cities = {}));
var Countries;
(function (Countries) {
    Countries["LIBYA"] = "libya";
    Countries["TURKEY"] = "turkey";
})(Countries || (exports.Countries = Countries = {}));
var UserTypes;
(function (UserTypes) {
    UserTypes["ADMIN"] = "admin";
    UserTypes["CUSTOMER"] = "customer";
})(UserTypes || (exports.UserTypes = UserTypes = {}));
const systemServices = ['auth', 'user', 'warehouse', 'config', 'shipments', 'dashboard'];
const getEndpoints = [
    '/getShippingConfig',
    '/getWarehouses',
    '/acl',
    '/getAllUsers',
    '/getAllUsersUnpaginated',
    '/getUser',
    '/getShipments',
    '/getShipmentsUnpaginated',
    '/getShipment',
    '/getInvoiceShipments',
    '/getShipmentsStatusCount',
    '/getUserAndShipmentCountPerYear',
];
const postEndpoints = [
    '/signUp',
    '/updateShippingConfig',
    '/createWarehouse',
    '/createUser',
    '/createShipment',
];
const updateEndpoints = [];
const deleteEndpoints = ['/deleteWarehouse', '/deleteUser', '/deleteShipment'];
const patchEndpoints = [
    '/updateWarehouse',
    '/acl',
    '/toggleUser',
    '/updateUser',
    '/updateProfile',
    '/updateShipment',
    '/updateShipments',
];
//# sourceMappingURL=types.js.map