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
exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const config_1 = require("../../config/config");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield song_model_1.default.find({
        deleted: false,
    }).select('title avatar slug singerId like topicId status');
    for (let song of songs) {
        const singerInfo = yield singer_model_1.default.find({
            _id: song.singerId,
            status: "active",
            deleted: false,
        }).select('fullName slug');
        song["singerInfo"] = singerInfo;
        const topic = yield topic_model_1.default.find({
            _id: song.topicId,
            status: "active",
            deleted: false
        }).select('title slug');
        song["topicInfo"] = topic;
    }
    res.render('admin/pages/song/index', {
        pageTitle: "Quản lý bài hát",
        songs: songs
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield topic_model_1.default.find({
        deleted: false,
        status: "active"
    }).select('title');
    const singer = yield singer_model_1.default.find({
        deleted: false,
        status: "active"
    }).select('fullName');
    res.render('admin/pages/song/create', {
        pageTitle: "Thêm mới bài hát",
        topics: topic,
        singers: singer
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lengthData = yield song_model_1.default.countDocuments({
        deleted: false,
    });
    let avatar = "";
    let audio = "";
    if (req.body.audio) {
        audio = req.body.audio[0];
    }
    if (req.body.avatar) {
        avatar = req.body.avatar[0];
    }
    const dataSongObject = {
        title: req.body.title,
        slug: req.body.slug,
        singerId: req.body.singerId,
        topicId: req.body.topicId,
        avatar: avatar,
        audio: audio,
        lyrics: req.body.lyrics,
        description: req.body.description,
        position: req.body.position || lengthData + 1,
        status: req.body.status,
    };
    const song = new song_model_1.default(dataSongObject);
    yield song.save();
    req.flash("success", "Thêm mới bài hát thành công");
    res.redirect(`${config_1.systemConfig.prefixAdmin}/song`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songId = req.params.id;
    const song = yield song_model_1.default.findOne({
        _id: songId,
        deleted: false,
    });
    const topic = yield topic_model_1.default.find({
        deleted: false,
        status: "active"
    }).select('title');
    const singer = yield singer_model_1.default.find({
        deleted: false,
        status: "active"
    }).select('fullName');
    res.render('admin/pages/song/edit', {
        pageTitle: "Chỉnh sửa bài hát",
        song: song,
        topics: topic,
        singers: singer
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songId = req.params.id;
    const song = yield song_model_1.default.findOne({
        _id: songId,
        deleted: false,
    });
    if (!song) {
        req.flash("error", "Bài hát không tồn tại");
        return res.redirect(`${config_1.systemConfig.prefixAdmin}/song`);
    }
    const lengthData = yield song_model_1.default.countDocuments({
        deleted: false,
    });
    const dataSongObject = {
        title: req.body.title,
        slug: req.body.slug,
        singerId: req.body.singerId,
        topicId: req.body.topicId,
        lyrics: req.body.lyrics,
        description: req.body.description,
        position: req.body.position || lengthData + 1,
        status: req.body.status,
    };
    if (req.body.audio) {
        dataSongObject["audio"] = req.body.audio[0];
    }
    if (req.body.avatar) {
        dataSongObject["avatar"] = req.body.avatar[0];
    }
    yield song_model_1.default.updateOne({ _id: songId }, dataSongObject);
    req.flash("success", "Cập nhật bài hát thành công");
    res.redirect(`${config_1.systemConfig.prefixAdmin}/song`);
});
exports.editPatch = editPatch;
