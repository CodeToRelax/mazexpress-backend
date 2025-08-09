"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateShippingPriceUtil = exports.generateAcl = exports.generateExternalTrackingNumber = exports.generateRandomUsername = exports.generateTrackingCode = exports.generateShippingNumber = exports.checkUserRules = exports.sanitizeSearchParam = exports.validateUserBirthdate = exports.checkAdminResponsibility = exports.validateAdminCanDoByCountry = exports.getAdminStatusesForCountry = exports.countriesEnum = exports.validateLibyanNumber = void 0;
const validator_1 = __importDefault(require("validator"));
const types_1 = require("./types");
const error_middleware_1 = require("../middlewares/error.middleware");
const validateLibyanNumber = (rawPhone) => {
    const phone = rawPhone.trim().replace(/[\s\-]/g, '');
    const libyanRegex = /^(?:\+218|0)?(91|92|94|95)\d{7}$/;
    return libyanRegex.test(phone);
};
exports.validateLibyanNumber = validateLibyanNumber;
var countriesEnum;
(function (countriesEnum) {
    countriesEnum["LIBYA"] = "libya";
    countriesEnum["TURKEY"] = "turkey";
    countriesEnum["CHINA"] = "china";
    countriesEnum["UAE"] = "uae";
})(countriesEnum || (exports.countriesEnum = countriesEnum = {}));
const countriesPerStatus = {
    [countriesEnum.TURKEY]: ['received at warehouse', 'shipped to destination'],
    [countriesEnum.LIBYA]: ['shipped to destination', 'ready for pick up', 'delivered'],
    [countriesEnum.CHINA]: ['received at warehouse', 'shipped to destination'],
    [countriesEnum.UAE]: ['received at warehouse', 'shipped to destination'],
};
const getAdminStatusesForCountry = (country) => {
    return countriesPerStatus[country] || [];
};
exports.getAdminStatusesForCountry = getAdminStatusesForCountry;
const validateAdminCanDoByCountry = (adminUser, newStatus) => {
    const country = adminUser?.address.country;
    const allowedStatuses = (0, exports.getAdminStatusesForCountry)(country);
    const normalizedStatus = newStatus.toLocaleLowerCase();
    if (!allowedStatuses.includes(normalizedStatus)) {
        throw new error_middleware_1.CustomErrorHandler(403, 'common.unauthorizedRole', `User from ${country} cannot set status "${newStatus}"`);
    }
};
exports.validateAdminCanDoByCountry = validateAdminCanDoByCountry;
const checkAdminResponsibility = (adminCountry, status) => {
    if (!adminCountry || !status)
        return false;
    const allowedStatuses = countriesPerStatus[adminCountry] || [];
    return allowedStatuses.includes(status.toLowerCase());
};
exports.checkAdminResponsibility = checkAdminResponsibility;
const validateUserBirthdate = (value) => {
    if (value > new Date())
        return false;
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 80);
    if (value < minDate)
        return false;
    return true;
};
exports.validateUserBirthdate = validateUserBirthdate;
const sanitizeSearchParam = (searchParam) => {
    return validator_1.default.escape(searchParam.toString());
};
exports.sanitizeSearchParam = sanitizeSearchParam;
const getBasePath = (urlPath) => {
    const parts = urlPath.split('/');
    return `${parts[0]}/${parts[1]}`;
};
const checkUserRules = async (acls, req) => {
    const methodName = req.method;
    const baseUrl = req.baseUrl.slice(1);
    const urlPath = getBasePath(req.path);
    console.log(urlPath);
    if (!acls[methodName] || !acls[methodName][baseUrl] || !acls[methodName][baseUrl]?.includes(urlPath)) {
        return false;
    }
    return true;
};
exports.checkUserRules = checkUserRules;
const generateShippingNumber = (customerType, city) => {
    if (customerType === types_1.UserTypes.ADMIN)
        return '0000';
    const prefix = city.slice(0, 3).toUpperCase();
    const randomNumbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10).toString()).join('');
    const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    const combinedChars = randomNumbers.split('');
    const randomPosition = Math.floor(Math.random() * (randomNumbers.length + 1));
    combinedChars.splice(randomPosition, 0, randomLetter);
    const suffix = combinedChars.join('');
    const result = `${prefix}-${suffix}`;
    return result;
};
exports.generateShippingNumber = generateShippingNumber;
const generateTrackingCode = () => {
    const letters = Array.from({ length: 3 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65));
    const numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString());
    const combined = letters.concat(numbers);
    for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined.join('');
};
exports.generateTrackingCode = generateTrackingCode;
const generateRandomUsername = (length = 10) => {
    return Math.random()
        .toString(20)
        .slice(2, length + 2);
};
exports.generateRandomUsername = generateRandomUsername;
const generateExternalTrackingNumber = (length = 10) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};
exports.generateExternalTrackingNumber = generateExternalTrackingNumber;
const generateAcl = (customerType) => {
    if (customerType === types_1.UserTypes.CUSTOMER) {
        return {
            GET: {
                warehouse: ['/getWarehouses'],
                config: [],
                auth: [],
                user: ['/getUser'],
                shipments: ['/getShipments', '/getShipment'],
                dashboard: [],
            },
            POST: {
                warehouse: [],
                auth: ['/signUp'],
                config: [],
                user: [],
                shipments: [],
            },
            DELETE: {
                warehouse: [],
                user: [],
                shipments: [],
            },
            PATCH: {
                warehouse: [],
                auth: [],
                user: ['/updateProfile'],
                shipments: [],
            },
            UPDATE: {
                warehouse: [],
                auth: [],
                user: [],
                shipments: [],
            },
        };
    }
    return {
        GET: {
            warehouse: ['/getWarehouses'],
            config: ['/getShippingConfig'],
            auth: [],
            user: ['/getAllUsers', '/getAllUsersUnpaginated', '/getUser'],
            shipments: ['/getShipments', '/getShipmentsUnpaginated', '/getShipment', '/getInvoiceShipments'],
            dashboard: ['/getShipmentsStatusCount', '/getUserAndShipmentCountPerYear', '/getOrdersPerDay'],
        },
        POST: {
            warehouse: ['/createWarehouse'],
            auth: [],
            config: ['/updateShippingConfig'],
            user: ['/createUser'],
            shipments: ['/createShipment'],
        },
        DELETE: {
            warehouse: ['/deleteWarehouse', '/deleteShipments'],
            user: [],
            shipments: [],
        },
        PATCH: {
            warehouse: ['/updateWarehouse'],
            auth: [],
            user: ['/toggleUser', '/updateUser', '/updateProfile'],
            shipments: ['/updateShipment', '/updateShipments', '/updateShipmentsEsn'],
        },
        UPDATE: {
            warehouse: [],
            auth: [],
            user: [],
            shipments: [],
        },
    };
};
exports.generateAcl = generateAcl;
const calculateShippingPriceUtil = (shippingMethod, weight, dimensions, dollarPrice, libyanExchangeRate) => {
    const actualWeight = parseFloat(weight ? weight : '0');
    let dimensionalWeight;
    if (dimensions && dimensions.length && dimensions.width && dimensions.height) {
        const length = parseFloat(dimensions.length);
        const width = parseFloat(dimensions.width);
        const height = parseFloat(dimensions.height);
        if (shippingMethod === 'sea') {
            dimensionalWeight = (length * width * height) / 4720;
        }
        else if (shippingMethod === 'air') {
            dimensionalWeight = (length * width * height) / 5000;
        }
    }
    const finalWeight = dimensionalWeight && dimensionalWeight > actualWeight ? dimensionalWeight : actualWeight;
    let price = 0;
    const usdPrice = Number(dollarPrice * libyanExchangeRate);
    if (shippingMethod === 'sea') {
        price = finalWeight * 2.5;
    }
    else if (shippingMethod === 'air') {
        price = finalWeight * usdPrice;
    }
    return price;
};
exports.calculateShippingPriceUtil = calculateShippingPriceUtil;
//# sourceMappingURL=helpers.js.map