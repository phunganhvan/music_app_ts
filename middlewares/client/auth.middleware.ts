import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";


interface AuthRequest extends Request {
    cookies: {
        tokenUser?: string;
    };
}

export const requireAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.tokenUser;

        // Không có token => chưa đăng nhập
        if (!token) {
            console.log("không có cookies");
            // req.flash("error", "Bạn không thể truy cập vào trang này");
            return res.redirect(`/user/login`);
        }

        // Tìm user theo token
        const user = await User.findOne({
            tokenUser: token,
        }).select("-password");

        if (!user) {
            console.log("không có người dùng");
            // req.flash("error", "Bạn không thể truy cập vào trang này");
            return res.redirect(`/user/login`);
        }

        // Nếu có user -> cho đi tiếp
        next();
    } catch (error) {
        console.error("Error in requireAuth middleware:", error);
        // req.flash("error", "Lỗi xác thực người dùng");
        return res.redirect(`/user/login`);
    }
};
export default requireAuth;