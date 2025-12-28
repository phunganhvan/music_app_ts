"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatch = exports.resetPasswordPost = exports.forgotPasswordPost = exports.loginPost = exports.registerPost = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const registerPost = (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.redirect(req.get("Referrer") || "/");
    }
    next();
};
exports.registerPost = registerPost;
const loginPost = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.redirect(req.get("Referrer") || "/");
    }
    next();
};
exports.loginPost = loginPost;
const forgotPasswordPost = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.redirect(req.get("Referrer") || "/");
    }
    next();
};
exports.forgotPasswordPost = forgotPasswordPost;
const resetPasswordPost = (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (!password) {
        return res.redirect(req.get("Referrer") || "/");
    }
    if (!confirmPassword) {
        return res.redirect(req.get("Referrer") || "/");
    }
    if (password !== confirmPassword) {
        return res.redirect(req.get("Referrer") || "/");
    }
    next();
};
exports.resetPasswordPost = resetPasswordPost;
const editPatch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.tokenUser;
    const user = yield user_model_1.default.findOne({
        tokenUser: token
    }).select("id password fullName");
    if (!user) {
        return res.redirect(req.get("Referrer") || "/");
    }
    if (!req.body.fullName) {
        req.body.fullName = user.fullName;
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.redirect(req.get("Referer") || "/");
    }
    if ((0, md5_1.default)(req.body.password) !== user.password) {
        return res.redirect(req.get("Referer") || "/");
    }
    next();
});
exports.editPatch = editPatch;
