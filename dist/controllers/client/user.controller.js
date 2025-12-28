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
exports.editUserInfo = exports.userInfo = exports.postResetPassword = exports.resetPassword = exports.postOtpPassword = exports.otpPassword = exports.postForgotPassword = exports.forgotPassword = exports.logout = exports.postLogin = exports.login = exports.postRegister = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const generate = __importStar(require("../../helpers/generate"));
const forgotPassword_model_1 = require("../../models/forgotPassword.model");
const sendMailHelper = __importStar(require("../../helpers/sendMail"));
const register = (req, res) => {
    res.render("client/pages/user/register", {
        title: "Đăng Ký",
    });
};
exports.register = register;
const postRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existEmail = yield user_model_1.default.findOne({
        email: req.body.email
    });
    if (existEmail) {
        req.flash("error", "Email đã tồn tại!");
        res.redirect(req.get("Referer"));
        return;
    }
    req.body.password = (0, md5_1.default)(req.body.password);
    req.body.tokenUser = generate.generateRandomString(50);
    const user = new user_model_1.default(req.body);
    yield user.save();
    res.locals.user = user;
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng ký thành công!");
    res.redirect("/user/login");
});
exports.postRegister = postRegister;
const login = (req, res) => {
    if (res.locals.user) {
        res.redirect("/");
        return;
    }
    res.render("client/pages/user/login", {
        pageTitle: "Đăng Nhập",
    });
};
exports.login = login;
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = (0, md5_1.default)(req.body.password);
    const user = yield user_model_1.default.findOne({
        email: email,
    });
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect(req.get("Referer"));
        return;
    }
    if (user.password !== password) {
        req.flash("error", "Mật khẩu không đúng!");
        res.redirect(req.get("Referer"));
        return;
    }
    res.locals.user = user;
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/topics");
});
exports.postLogin = postLogin;
const logout = (req, res) => {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công!");
    res.redirect("/user/login");
};
exports.logout = logout;
const forgotPassword = (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên Mật Khẩu",
    });
};
exports.forgotPassword = forgotPassword;
const postForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({
        email: email,
    });
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect(req.get("Referer"));
        return;
    }
    if (user.status === "locked") {
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect(req.get("Referer"));
        return;
    }
    const otp = generate.generateRandomOtp(6);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAfter: new Date(Date.now() + 12 * 10000)
    };
    const forgotPassword = new forgotPassword_model_1.ForgotPassword(objectForgotPassword);
    yield forgotPassword.save();
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
            Mã OTP để lấy lại mật khẩu là <b style="color: green; font-size: 24px">${otp}</b>. Thời hạn sử dụng là 2 phút.
        `;
    sendMailHelper.sendMail(email, subject, html);
    req.flash("success", "Mã OTP đặt lại mật khẩu đã được gửi đến email của bạn!");
    res.redirect(`/user/password/otp?email=${email}`);
});
exports.postForgotPassword = postForgotPassword;
const otpPassword = (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Xác Minh OTP",
        email: email
    });
};
exports.otpPassword = otpPassword;
const postOtpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const forgotPasswordRecord = yield forgotPassword_model_1.ForgotPassword.findOne({
        email: email,
    });
    if (!forgotPasswordRecord) {
        req.flash("error", "Mã OTP không còn tồn tại. Vui lòng thử lại");
        res.redirect("/user/password/forgot");
        return;
    }
    if (forgotPasswordRecord.otp !== otp) {
        req.flash("error", "Mã OTP không đúng. Vui lòng thử lại");
        res.redirect(`/user/password/otp?email=${email}`);
        return;
    }
    const user = yield user_model_1.default.findOne({
        email: email,
    });
    res.cookie("tokenUser", user === null || user === void 0 ? void 0 : user.tokenUser);
    req.flash("success", "Xác minh OTP thành công! Vui lòng đặt lại mật khẩu.");
    res.redirect("/user/password/reset");
});
exports.postOtpPassword = postOtpPassword;
const resetPassword = (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt Lại Mật Khẩu",
    });
};
exports.resetPassword = resetPassword;
const postResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = (0, md5_1.default)(req.body.password);
    const tokenUser = req.cookies.tokenUser;
    yield user_model_1.default.updateOne({ tokenUser: tokenUser }, { password: newPassword });
    res.clearCookie("tokenUser");
    req.flash("success", "Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
    res.redirect("/user/login");
});
exports.postResetPassword = postResetPassword;
const userInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/info", {
        pageTitle: "Thông Tin Người Dùng",
    });
});
exports.userInfo = userInfo;
const editUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/edit-info", {
        pageTitle: "Chỉnh Sửa Thông Tin Người Dùng",
    });
});
exports.editUserInfo = editUserInfo;
