import md5 from "md5";
import User from "../../models/user.model";
import * as generate from "../../helpers/generate";
import { ForgotPassword } from "../../models/forgotPassword.model";
import * as sendMailHelper from "../../helpers/sendMail";
// [GET] /user/register

export const register = (req: any, res: any) => {
    res.render("client/pages/user/register", {
        title: "Đăng Ký",
    });
}

// [POST] /user/register
export const postRegister = async (req: any, res: any) => {
    const existEmail = await User.findOne({
        email: req.body.email
    });
    if (existEmail) {
        req.flash("error", "Email đã tồn tại!");
        res.redirect(req.get("Referer"));
        return;
    }
    req.body.password = md5(req.body.password);
    req.body.tokenUser= generate.generateRandomString(50);
    const user = new User(req.body)
    await user.save();
    res.locals.user= user
    res.cookie("tokenUser", user.tokenUser)
    req.flash("success", "Đăng ký thành công!");
    res.redirect("/user/login");
};

// [GET] /user/login
export const login = (req: any, res: any) => {
    if (res.locals.user){
        res.redirect("/");
        return;
    }
    res.render("client/pages/user/login", {
        pageTitle: "Đăng Nhập",
    });
};

// [POST] /user/login 
export const postLogin = async (req: any, res: any) => {
    const email = req.body.email;
    const password = md5(req.body.password);
    const user= await User.findOne({
        email: email,
    });
    if(!user){
        req.flash("error", "Email không tồn tại!");
        res.redirect(req.get("Referer"));
        return;
    }
    if(user.password !== password){
        req.flash("error", "Mật khẩu không đúng!");
        res.redirect(req.get("Referer"));
        return;
    }
    res.locals.user= user
    res.cookie("tokenUser", user.tokenUser)
    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/topics");
};
// [GET] /user/logout
export const logout = (req: any, res: any) => {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công!");
    res.redirect("/user/login");
}
// [GET] /user/password/forgot
export const forgotPassword = (req: any, res: any) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên Mật Khẩu",
    });
};

// [POST] /user/password/forgot
export const postForgotPassword = async (req: any, res: any) => {
    const email = req.body.email;
    const user= await User.findOne({
        email: email,
    });
    if(!user){
        req.flash("error", "Email không tồn tại!");
        res.redirect(req.get("Referer"));
        return;
    }
    if (user.status === "locked") {
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect(req.get("Referer"));
        return;
    }

    // lưu thông tin vào db rồi mới gửi
    const otp = generate.generateRandomOtp(6)
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAfter: new Date(Date.now() + 12 * 10000)
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
        const html = `
            Mã OTP để lấy lại mật khẩu là <b style="color: green; font-size: 24px">${otp}</b>. Thời hạn sử dụng là 2 phút.
        `;
    
    sendMailHelper.sendMail(email, subject, html);
    // Logic to send password reset email would go here
    req.flash("success", "Mã OTP đặt lại mật khẩu đã được gửi đến email của bạn!");
    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
export const otpPassword = (req: any, res: any) => {   
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Xác Minh OTP",
        email: email
    });
}
export const postOtpPassword = async (req: any, res: any) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const forgotPasswordRecord = await ForgotPassword.findOne({
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
    const user= await User.findOne({
        email: email,
    });
    res.cookie("tokenUser", user?.tokenUser)
    req.flash("success", "Xác minh OTP thành công! Vui lòng đặt lại mật khẩu.");
    res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
export const resetPassword = (req: any, res: any) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt Lại Mật Khẩu",
    });
};

// [POST] /user/password/reset
export const postResetPassword = async (req: any, res: any) => {
    const newPassword = md5(req.body.password);
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne(
        { tokenUser: tokenUser },
        { password: newPassword }
    );
    res.clearCookie("tokenUser");
    req.flash("success", "Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
    res.redirect("/user/login");
}

// [GET] /user/info
export const userInfo= async (req: any, res: any) => {
    res.render("client/pages/user/info", {
        pageTitle: "Thông Tin Người Dùng",
    });
}

// [GET] /user/info/edit
export const editUserInfo= async (req: any, res: any) => {
    res.render("client/pages/user/edit-info", {
        pageTitle: "Chỉnh Sửa Thông Tin Người Dùng",
    });
}