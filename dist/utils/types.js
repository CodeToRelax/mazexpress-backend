"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = exports.ShipmentStatus = exports.ShippingMethod = exports.ToggleState = exports.UserTypes = exports.Countries = exports.Cities = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALe"] = "female";
})(Gender || (exports.Gender = Gender = {}));
var Cities;
(function (Cities) {
    Cities["BENGHAZI"] = "benghazi";
    Cities["TRIPOLI"] = "tripoli";
    Cities["MUSRATA"] = "musrata";
    Cities["ALBAYDA"] = "al bayda";
    Cities["ZAWIYA"] = "zawiya";
    Cities["GHARYAN"] = "gharyan";
    Cities["TOBRUK"] = "tobruk";
    Cities["AJDABIYA"] = "ajdabiya";
    Cities["ZLITEN"] = "zliten";
    Cities["DERNA"] = "derna";
    Cities["SIRTE"] = "sirte";
    Cities["SABHA"] = "sabha";
    Cities["KHOMS"] = "khoms";
    Cities["BANI_WALID"] = "bani walid";
    Cities["SABRATHA"] = "sabratha";
    Cities["ZUWARA"] = "zuwara";
    Cities["KUFFRA"] = "kufra";
    Cities["AL_MARJ"] = "al marj";
    Cities["TARHUNA"] = "tarhuna";
    Cities["UBARI"] = "ubari";
    Cities["GADAMES"] = "gadames";
    Cities["GHAT"] = "ghat";
    Cities["NALUT"] = "nalut";
    Cities["JALU"] = "jalu";
    Cities["BREGA"] = "brega";
    Cities["ISTANBUL"] = "istanbul";
    Cities["DUBAI"] = "dubai";
    Cities["HONGKONG"] = "hongkong";
})(Cities || (exports.Cities = Cities = {}));
var Countries;
(function (Countries) {
    Countries["LIBYA"] = "libya";
    Countries["TURKEY"] = "turkey";
    Countries["CHINA"] = "china";
    Countries["UAE"] = "uae";
})(Countries || (exports.Countries = Countries = {}));
var UserTypes;
(function (UserTypes) {
    UserTypes["ADMIN"] = "admin";
    UserTypes["CUSTOMER"] = "customer";
})(UserTypes || (exports.UserTypes = UserTypes = {}));
var ToggleState;
(function (ToggleState) {
    ToggleState["ENABLE"] = "enable";
    ToggleState["DISABLE"] = "disable";
})(ToggleState || (exports.ToggleState = ToggleState = {}));
var ShippingMethod;
(function (ShippingMethod) {
    ShippingMethod["SEA"] = "sea";
    ShippingMethod["AIR"] = "air";
    ShippingMethod["land"] = "land";
})(ShippingMethod || (exports.ShippingMethod = ShippingMethod = {}));
var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus["RECEIVED_AT_WAREHOUSE"] = "received at warehouse";
    ShipmentStatus["SHIPPED_TO_DESTINATION"] = "shipped to destination";
    ShipmentStatus["READY_FOR_PICK_UP"] = "ready for pick up";
    ShipmentStatus["DELIVERED"] = "delivered";
})(ShipmentStatus || (exports.ShipmentStatus = ShipmentStatus = {}));
const systemServices = ['auth', 'user', 'warehouse', 'config', 'shipments', 'dashboard', 'wallet'];
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
    '/getOrdersPerDay',
    '/balance',
    '/details',
    '/transactions',
    '/transaction',
    '/admin/all',
    '/admin/user',
];
const postEndpoints = [
    '/signUp',
    '/updateShippingConfig',
    '/createWarehouse',
    '/createUser',
    '/createShipment',
    '/admin/transaction',
    '/admin/create',
];
const updateEndpoints = [];
const deleteEndpoints = ['/deleteWarehouse', '/deleteUser', '/deleteShipments'];
const patchEndpoints = [
    '/updateWarehouse',
    '/acl',
    '/toggleUser',
    '/updateUser',
    '/updateProfile',
    '/updateShipment',
    '/updateShipments',
    '/updateShipmentsEsn',
    '/admin/deactivate',
    '/admin/reactivate',
    '/admin/currency',
];
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["CLIENT_ERROR_BAD_REQUEST"] = 400] = "CLIENT_ERROR_BAD_REQUEST";
    StatusCode[StatusCode["CLIENT_ERROR_CONFLICT"] = 409] = "CLIENT_ERROR_CONFLICT";
    StatusCode[StatusCode["CLIENT_ERROR_EXPECTATION_FAILED"] = 417] = "CLIENT_ERROR_EXPECTATION_FAILED";
    StatusCode[StatusCode["CLIENT_ERROR_FAILED_DEPENDENCY"] = 424] = "CLIENT_ERROR_FAILED_DEPENDENCY";
    StatusCode[StatusCode["CLIENT_ERROR_FORBIDDEN"] = 403] = "CLIENT_ERROR_FORBIDDEN";
    StatusCode[StatusCode["CLIENT_ERROR_GONE"] = 410] = "CLIENT_ERROR_GONE";
    StatusCode[StatusCode["CLIENT_ERROR_I_M_A_TEAPOT"] = 418] = "CLIENT_ERROR_I_M_A_TEAPOT";
    StatusCode[StatusCode["CLIENT_ERROR_LENGTH_REQUIRED"] = 411] = "CLIENT_ERROR_LENGTH_REQUIRED";
    StatusCode[StatusCode["CLIENT_ERROR_LOCKED"] = 423] = "CLIENT_ERROR_LOCKED";
    StatusCode[StatusCode["CLIENT_ERROR_LOGIN_TIMEOUT"] = 440] = "CLIENT_ERROR_LOGIN_TIMEOUT";
    StatusCode[StatusCode["CLIENT_ERROR_METHOD_NOT_ALLOWED"] = 405] = "CLIENT_ERROR_METHOD_NOT_ALLOWED";
    StatusCode[StatusCode["CLIENT_ERROR_MISDIRECTED_REQUEST"] = 421] = "CLIENT_ERROR_MISDIRECTED_REQUEST";
    StatusCode[StatusCode["CLIENT_ERROR_NOT_ACCEPTABLE"] = 406] = "CLIENT_ERROR_NOT_ACCEPTABLE";
    StatusCode[StatusCode["CLIENT_ERROR_NOT_FOUND"] = 404] = "CLIENT_ERROR_NOT_FOUND";
    StatusCode[StatusCode["CLIENT_ERROR_PAYLOAD_TOO_LARGE"] = 413] = "CLIENT_ERROR_PAYLOAD_TOO_LARGE";
    StatusCode[StatusCode["CLIENT_ERROR_PAYMENT_REQUIRED"] = 402] = "CLIENT_ERROR_PAYMENT_REQUIRED";
    StatusCode[StatusCode["CLIENT_ERROR_PRECONDITION_FAILED"] = 412] = "CLIENT_ERROR_PRECONDITION_FAILED";
    StatusCode[StatusCode["CLIENT_ERROR_PRECONDITION_REQUIRED"] = 428] = "CLIENT_ERROR_PRECONDITION_REQUIRED";
    StatusCode[StatusCode["CLIENT_ERROR_PROXY_AUTH_REQUIRED"] = 407] = "CLIENT_ERROR_PROXY_AUTH_REQUIRED";
    StatusCode[StatusCode["CLIENT_ERROR_RANGE_NOT_SATISFIABLE"] = 416] = "CLIENT_ERROR_RANGE_NOT_SATISFIABLE";
    StatusCode[StatusCode["CLIENT_ERROR_REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "CLIENT_ERROR_REQUEST_HEADER_FIELDS_TOO_LARGE";
    StatusCode[StatusCode["CLIENT_ERROR_REQUEST_TIMEOUT"] = 408] = "CLIENT_ERROR_REQUEST_TIMEOUT";
    StatusCode[StatusCode["CLIENT_ERROR_RETRY_WITH"] = 449] = "CLIENT_ERROR_RETRY_WITH";
    StatusCode[StatusCode["CLIENT_ERROR_TOO_MANY_REQUESTS"] = 429] = "CLIENT_ERROR_TOO_MANY_REQUESTS";
    StatusCode[StatusCode["CLIENT_ERROR_UNAUTHORIZED"] = 401] = "CLIENT_ERROR_UNAUTHORIZED";
    StatusCode[StatusCode["CLIENT_ERROR_UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "CLIENT_ERROR_UNAVAILABLE_FOR_LEGAL_REASONS";
    StatusCode[StatusCode["CLIENT_ERROR_UNPROCESSABLE_ENTITY"] = 422] = "CLIENT_ERROR_UNPROCESSABLE_ENTITY";
    StatusCode[StatusCode["CLIENT_ERROR_UNSUPPORTED_MEDIA_TYPE"] = 415] = "CLIENT_ERROR_UNSUPPORTED_MEDIA_TYPE";
    StatusCode[StatusCode["CLIENT_ERROR_UPGRADE_REQUIRED"] = 426] = "CLIENT_ERROR_UPGRADE_REQUIRED";
    StatusCode[StatusCode["CLIENT_ERROR_URI_TOO_LONG"] = 414] = "CLIENT_ERROR_URI_TOO_LONG";
    StatusCode[StatusCode["INFO_CONTINUE"] = 100] = "INFO_CONTINUE";
    StatusCode[StatusCode["INFO_PROCESSING"] = 102] = "INFO_PROCESSING";
    StatusCode[StatusCode["INFO_SWITCHING_PROTOCOLS"] = 101] = "INFO_SWITCHING_PROTOCOLS";
    StatusCode[StatusCode["REDIRECT_FOUND"] = 302] = "REDIRECT_FOUND";
    StatusCode[StatusCode["REDIRECT_MOVED_PERMANENTLY"] = 301] = "REDIRECT_MOVED_PERMANENTLY";
    StatusCode[StatusCode["REDIRECT_MULTIPLE_CHOICES"] = 300] = "REDIRECT_MULTIPLE_CHOICES";
    StatusCode[StatusCode["REDIRECT_NOT_MODIFIED"] = 304] = "REDIRECT_NOT_MODIFIED";
    StatusCode[StatusCode["REDIRECT_PERMANENT"] = 308] = "REDIRECT_PERMANENT";
    StatusCode[StatusCode["REDIRECT_SEE_OTHER"] = 303] = "REDIRECT_SEE_OTHER";
    StatusCode[StatusCode["REDIRECT_SWITCH_PROXY"] = 306] = "REDIRECT_SWITCH_PROXY";
    StatusCode[StatusCode["REDIRECT_TEMP"] = 307] = "REDIRECT_TEMP";
    StatusCode[StatusCode["REDIRECT_USE_PROXY"] = 305] = "REDIRECT_USE_PROXY";
    StatusCode[StatusCode["SERVER_ERROR_BAD_GATEWAY"] = 502] = "SERVER_ERROR_BAD_GATEWAY";
    StatusCode[StatusCode["SERVER_ERROR_BANDWIDTH_LIMIT_EXCEEDED"] = 509] = "SERVER_ERROR_BANDWIDTH_LIMIT_EXCEEDED";
    StatusCode[StatusCode["SERVER_ERROR_GATEWAY_TIMEOUT"] = 504] = "SERVER_ERROR_GATEWAY_TIMEOUT";
    StatusCode[StatusCode["SERVER_ERROR_HTTP_VERSION_NOT_SUPPORTED"] = 505] = "SERVER_ERROR_HTTP_VERSION_NOT_SUPPORTED";
    StatusCode[StatusCode["SERVER_ERROR_INSUFFICIENT_STORAGE"] = 507] = "SERVER_ERROR_INSUFFICIENT_STORAGE";
    StatusCode[StatusCode["SERVER_ERROR_INTERNAL"] = 500] = "SERVER_ERROR_INTERNAL";
    StatusCode[StatusCode["SERVER_ERROR_LOOP_DETECTED"] = 508] = "SERVER_ERROR_LOOP_DETECTED";
    StatusCode[StatusCode["SERVER_ERROR_NETWORK_AUTH_REQUIRED"] = 511] = "SERVER_ERROR_NETWORK_AUTH_REQUIRED";
    StatusCode[StatusCode["SERVER_ERROR_NOT_EXTENDED"] = 510] = "SERVER_ERROR_NOT_EXTENDED";
    StatusCode[StatusCode["SERVER_ERROR_NOT_IMPLEMENTED"] = 501] = "SERVER_ERROR_NOT_IMPLEMENTED";
    StatusCode[StatusCode["SERVER_ERROR_SERVICE_UNAVAILABLE"] = 503] = "SERVER_ERROR_SERVICE_UNAVAILABLE";
    StatusCode[StatusCode["SERVER_ERROR_VARIANT_ALSO_NEGOTIATES"] = 506] = "SERVER_ERROR_VARIANT_ALSO_NEGOTIATES";
    StatusCode[StatusCode["SUCCESS_ACCEPTED"] = 202] = "SUCCESS_ACCEPTED";
    StatusCode[StatusCode["SUCCESS_ALREADY_REPORTED"] = 208] = "SUCCESS_ALREADY_REPORTED";
    StatusCode[StatusCode["SUCCESS_CREATED"] = 201] = "SUCCESS_CREATED";
    StatusCode[StatusCode["SUCCESS_IM_USED"] = 229] = "SUCCESS_IM_USED";
    StatusCode[StatusCode["SUCCESS_MULTI_STATUS"] = 207] = "SUCCESS_MULTI_STATUS";
    StatusCode[StatusCode["SUCCESS_NO_CONTENT"] = 204] = "SUCCESS_NO_CONTENT";
    StatusCode[StatusCode["SUCCESS_NON_AUTHORITATIVE_INFO"] = 203] = "SUCCESS_NON_AUTHORITATIVE_INFO";
    StatusCode[StatusCode["SUCCESS_OK"] = 200] = "SUCCESS_OK";
    StatusCode[StatusCode["SUCCESS_PARTIAL_CONTENT"] = 206] = "SUCCESS_PARTIAL_CONTENT";
    StatusCode[StatusCode["SUCCESS_RESET_CONTENT"] = 205] = "SUCCESS_RESET_CONTENT";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
//# sourceMappingURL=types.js.map