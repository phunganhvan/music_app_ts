"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatch = exports.createPost = void 0;
const createPost = (req, res, next) => {
    const { title, singerId, topicId, description, status, avatar } = req.body;
    if (!title || !singerId || !topicId || !description || !avatar) {
        req.flash("error", "Vui lòng điền đầy đủ thông tin");
        res.redirect(req.get('Referer'));
        return;
    }
    next();
};
exports.createPost = createPost;
const editPatch = (req, res, next) => {
    const { title } = req.body;
    if (!title) {
        req.flash("error", "Vui lòng điền đầy đủ thông tin");
        res.redirect(req.get('Referer'));
        return;
    }
    next();
};
exports.editPatch = editPatch;
