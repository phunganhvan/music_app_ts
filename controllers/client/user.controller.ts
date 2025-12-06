import md5 from "md5";
import User from "../../models/user.model";


// [GET] /user/register

export const register = (req: any, res: any) => {
    res.render("client/pages/user/register", {
        title: "Đăng Ký Tài Khoản",
        
    });
}