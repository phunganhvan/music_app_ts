"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassword = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const forgotPasswordSchema = new mongoose_1.default.Schema({
    email: String,
    otp: String,
    expiresAfter: {
        type: Date,
        expires: 0
    }
}, {
    timestamps: true,
});
exports.ForgotPassword = mongoose_1.default.model("ForgotPassword", forgotPasswordSchema, "forgotPassword");
