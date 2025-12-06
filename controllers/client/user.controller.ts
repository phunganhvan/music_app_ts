import md5 from "md5";
import User from "../../models/user.model";
import * as generate from "../../helpers/generate";

// [GET] /user/register

export const register = (req: any, res: any) => {
    res.render("client/pages/user/register", {
        title: "Đăng Ký Tài Khoản",
    });
}

// [POST] /user/register
export const postRegister = async (req: any, res: any) => {
    const existEmail = await User.findOne({
        email: req.body.email
    });
    if (existEmail) {
        res.redirect(req.get("Referer"));
    }
    req.body.password = md5(req.body.password);
    req.body.tokenUser= generate.generateRandomString(50);
    const user = new User(req.body)
    await user.save();
    res.locals.user= user
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/");
};

// [GET] /user/login