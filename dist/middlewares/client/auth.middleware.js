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
exports.requireAuth = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.tokenUser;
        if (!token) {
            console.log("không có cookies");
            return res.redirect(`/user/login`);
        }
        const user = yield user_model_1.default.findOne({
            tokenUser: token,
        }).select("-password");
        if (!user) {
            console.log("không có người dùng");
            return res.redirect(`/user/login`);
        }
        next();
    }
    catch (error) {
        console.error("Error in requireAuth middleware:", error);
        return res.redirect(`/user/login`);
    }
});
exports.requireAuth = requireAuth;
exports.default = exports.requireAuth;
