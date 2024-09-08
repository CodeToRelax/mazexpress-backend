"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateShippingPriceUtil = exports.checkAdminResponsibility = exports.generateAcl = exports.generateExternalTrackingNumber = exports.generateRandomUsername = exports.generateTrackingCode = exports.generateShippingNumber = exports.checkUserRules = exports.sanitizeSearchParam = exports.validateUserBirthdate = exports.validateLibyanNumber = exports.countriesEnum = void 0;
const validator_1 = __importDefault(require("validator"));
const types_1 = require("./types");
var countriesEnum;
(function (countriesEnum) {
    countriesEnum["LIBYA"] = "libya";
    countriesEnum["TURKEY"] = "turkey";
})(countriesEnum || (exports.countriesEnum = countriesEnum = {}));
const countriesPerStatus = {
    [countriesEnum.TURKEY]: ['received at warehouse', 'shipped to destination'],
    [countriesEnum.LIBYA]: ['ready for pick up', 'delivered'],
};
const validateLibyanNumber = (phoneNumber) => {
    const allowedCarriers = ['91', '92', '94', '95'];
    const firstTwoNumbers = phoneNumber.slice(0, 2);
    return allowedCarriers.includes(firstTwoNumbers) && phoneNumber.length === 9 ? true : false;
};
exports.validateLibyanNumber = validateLibyanNumber;
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
            config: [],
            auth: [],
            user: ['/getAllUsers', '/getAllUsersUnpaginated', '/getUser'],
            shipments: ['/getShipments', '/getShipmentsUnpaginated', '/getShipment', '/getInvoiceShipments'],
            dashboard: ['/getShipmentsStatusCount', '/getUserAndShipmentCountPerYear'],
        },
        POST: {
            warehouse: [],
            auth: [],
            config: [],
            user: ['/createUser'],
            shipments: ['/createShipment'],
        },
        DELETE: {
            warehouse: [],
            user: [],
            shipments: [],
        },
        PATCH: {
            warehouse: ['/updateWarehouse'],
            auth: [],
            user: ['/toggleUser', '/updateUser', '/updateProfile'],
            shipments: ['/updateShipment', '/updateShipments'],
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
const checkAdminResponsibility = (adminCountry, status) => {
    return countriesPerStatus[adminCountry].includes(status.toLocaleLowerCase());
};
exports.checkAdminResponsibility = checkAdminResponsibility;
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