"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAcl = exports.generateExternalTrackingNumber = exports.generateRandomUsername = exports.generateShippingNumber = exports.checkUserRules = exports.sanitizeSearchParam = exports.validateUserBirthdate = exports.validateLibyanNumber = void 0;
const validator_1 = __importDefault(require("validator"));
const types_1 = require("./types");
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
const checkUserRules = async (acls, req) => {
    const methodName = req.method;
    const baseUrl = req.baseUrl.slice(1);
    const urlPath = req.path;
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
            GET: {},
            POST: { auth: ['/signUp'] },
            UPDATE: {},
            DELETE: {},
            PATCH: {},
        };
    }
    return {
        GET: {},
        POST: { auth: ['/signUp'] },
        UPDATE: {},
        DELETE: {},
        PATCH: {},
    };
};
exports.generateAcl = generateAcl;
//# sourceMappingURL=helpers.js.map