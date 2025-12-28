"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const controller = __importStar(require("../../controllers/client/user.controller"));
const validate = __importStar(require("../../validates/client/user.validate"));
const authMiddleware = __importStar(require("../../middlewares/client/auth.middleware"));
router.get('/register', controller.register);
router.post('/register', validate.registerPost, controller.postRegister);
router.get('/login', controller.login);
router.post('/login', validate.loginPost, controller.postLogin);
router.get('/logout', controller.logout);
router.get('/password/forgot', controller.forgotPassword);
router.post('/password/forgot', validate.forgotPasswordPost, controller.postForgotPassword);
router.get('/password/otp', controller.otpPassword);
router.post('/password/otp', controller.postOtpPassword);
router.get('/password/reset', controller.resetPassword);
router.post('/password/reset', validate.resetPasswordPost, controller.postResetPassword);
router.get('/info', authMiddleware.requireAuth, controller.userInfo);
router.get('/info/edit', authMiddleware.requireAuth, controller.editUserInfo);
exports.UserRoute = router;
