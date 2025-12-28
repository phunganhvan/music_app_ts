"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomOtp = exports.generateRandomString = void 0;
const alphaNumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const numericChars = "0123456789";
const generateRandomString = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += alphaNumericChars.charAt(Math.floor(Math.random() * alphaNumericChars.length));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
const generateRandomOtp = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += numericChars.charAt(Math.floor(Math.random() * numericChars.length));
    }
    return result;
};
exports.generateRandomOtp = generateRandomOtp;
