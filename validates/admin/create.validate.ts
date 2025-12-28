import { Request, Response, NextFunction } from "express";
export const createPost = (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    const { title, singerId, topicId, description, status, avatar } = req.body;
    // console.log(title, singerId, topicId, description, status, avatar);
    if (!title || !singerId || !topicId || !description || !avatar) {
        req.flash("error", "Vui lòng điền đầy đủ thông tin");
        res.redirect(req.get('Referer'));
        return;
    }
    next();
};

export const editPatch = (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    const {title} = req.body;
    if (!title) {
        req.flash("error", "Vui lòng điền đầy đủ thông tin");
        res.redirect(req.get('Referer'));
        return;
    }
    next();
};