import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model"; // chỉnh lại path cho đúng

interface CustomRequest extends Request {
    cookies: {
        tokenUser?: string;
    };
}

export const infoUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.tokenUser;

        if (token) {
            const user= await User.findOne({
                tokenUser: token,
                deleted: false,
                status: "active",
            }).select("-password");

            if (user) {
                res.locals.user = user;
            }
        }

        next();
    } catch (error) {
        console.error("Error in infoUser middleware:", error);
        next(error);
    }
};
