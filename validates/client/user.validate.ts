import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import md5 from "md5";

// Mở rộng Request để có cookies và flash
interface CustomRequest extends Request {
    cookies: {
        tokenUser?: string;
    };
    // flash(type: string, message: string): void;
}

export const registerPost = (req: CustomRequest, res: Response, next: NextFunction) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        // req.flash("error", "Vui lòng nhập đủ thông tin");
        return res.redirect(req.get("Referrer") || "/");
    }

    next();
};

export const loginPost = (req: CustomRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        // req.flash("error", "Vui lòng nhập đủ thông tin");
        return res.redirect(req.get("Referrer") || "/");
    }

    next();
};

export const forgotPasswordPost = (req: CustomRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
        // req.flash("error", "Vui lòng nhập email");
        return res.redirect(req.get("Referrer") || "/");
    }

    next();
};

export const resetPasswordPost = (req: CustomRequest, res: Response, next: NextFunction) => {
    const { password, confirmPassword } = req.body;

    if (!password) {
        // req.flash("error", "Vui lòng nhập mật khẩu");
        return res.redirect(req.get("Referrer") || "/");
    }

    if (!confirmPassword) {
        // req.flash("error", "Vui lòng xác nhận mật khẩu");
        return res.redirect(req.get("Referrer") || "/");
    }

    if (password !== confirmPassword) {
        // req.flash("error", "Mật khẩu không trùng khớp. Vui lòng kiểm tra lại");
        return res.redirect(req.get("Referrer") || "/");
    }

    next();
};

export const editPatch = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.tokenUser;

    const user = await User.findOne({
        tokenUser: token
    }).select("id password fullName");

    if (!user) {
        // req.flash("error", "Không tìm thấy người dùng");
        return res.redirect(req.get("Referrer") || "/");
    }

    // nếu fullName trống → giữ nguyên
    if (!req.body.fullName) {
        req.body.fullName = user.fullName;
    }

    // kiểm tra password mới
    if (req.body.newPassword !== req.body.confirmPassword) {
        // req.flash("error", "Mật khẩu xác nhận không trùng khớp, vui lòng thử lại");
        return res.redirect(req.get("Referer") || "/");
    }

    // kiểm tra mật khẩu hiện tại
    if (md5(req.body.password) !== user.password) {
        // req.flash("error", "Mật khẩu hiện tại không chính xác, vui lòng kiểm tra lại");
        return res.redirect(req.get("Referer") || "/");
    }

    next();
};