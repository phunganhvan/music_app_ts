import md5 from "md5";
import User from "../../models/user.model";
import * as generate from "../../helpers/generate";

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
        title: "Đăng Nhập",
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
    console.log(user);
    res.locals.user= user
    console.log("user login", res.locals.user);
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
        title: "Quên Mật Khẩu",
    });
};
