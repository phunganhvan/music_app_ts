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
exports.listen = exports.favorite = exports.like = exports.detail = exports.listSongsByTopic = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const listSongsByTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield topic_model_1.default.findOne({
        slug: req.params.slugTopic,
        status: "active",
        deleted: false,
    });
    if (!topic) {
        res.redirect("/");
    }
    const songs = yield song_model_1.default.find({
        topicId: topic._id.toString(),
        status: "active",
        deleted: false,
    }).select("title avatar slug singerId like");
    for (let song of songs) {
        const singerInfo = yield singer_model_1.default.find({
            _id: song.singerId,
            status: "active",
            deleted: false,
        });
        song["singerInfo"] = singerInfo;
    }
    res.render("client/pages/songs/index", {
        pageTitle: topic.title,
        songs: songs,
    });
});
exports.listSongsByTopic = listSongsByTopic;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield song_model_1.default.findOne({
        slug: req.params.slugSong,
        status: "active",
        deleted: false,
    });
    if (!song) {
        res.redirect("/");
    }
    const singerInfo = yield singer_model_1.default.find({
        _id: song.singerId,
        status: "active",
        deleted: false,
    });
    const topic = yield topic_model_1.default.findOne({
        _id: song.topicId,
        status: "active",
        deleted: false,
    });
    const favoriteSong = yield favorite_song_model_1.default.findOne({
        songId: song._id.toString(),
        userId: req.cookies.userId,
    });
    song["isFavorite"] = favoriteSong ? true : false;
    song["singerName"] = singerInfo[0].fullName;
    song["topicTitle"] = topic.title;
    res.render("client/pages/songs/detail", {
        pageTitle: song.title,
        song: song,
        singerInfo: singerInfo,
        topic: topic,
    });
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songId = req.params.songId;
    const typeLike = req.params.typeLike;
    const song = yield song_model_1.default.findById(songId);
    if (!song) {
        return res.status(404).json({ message: "Song not found" });
    }
    const newLikeCount = typeLike === "yes" ? song.like + 1 : song.like - 1;
    yield song_model_1.default.updateOne({
        _id: songId,
    }, {
        like: newLikeCount,
    });
    req.flash('success', typeLike === "yes" ? 'Bạn đã thích bài hát' : 'Bạn đã bỏ thích bài hát');
    res.status(200).json({
        code: 200,
        message: "Liked successfully",
        like: newLikeCount,
        flash: req.flash('success'),
    });
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songId = req.params.songId;
    const typeFavorite = req.params.typeFavorite;
    if (req.cookies.tokenUser) {
        switch (typeFavorite) {
            case "add":
                const existFavorite = yield favorite_song_model_1.default.findOne({
                    songId: songId,
                    userId: req.cookies.userId,
                });
                if (!existFavorite) {
                    const newFavorite = new favorite_song_model_1.default({
                        songId: songId,
                        userId: req.cookies.userId,
                    });
                    yield newFavorite.save();
                    req.flash('success', 'Thêm bài hát yêu thích thành công');
                    res.status(200).json({
                        code: 200,
                        message: "Favorite updated successfully",
                        flash: req.flash('success'),
                    });
                }
                break;
            case "remove":
                yield favorite_song_model_1.default.deleteOne({
                    songId: songId,
                    userId: req.cookies.userId,
                });
                req.flash('success', 'Xóa bài hát yêu thích thành công');
                res.status(200).json({
                    code: 200,
                    message: "Favorite updated successfully",
                    flash: req.flash('success'),
                });
                break;
            default:
                break;
        }
    }
    else {
        res.status(400).json({
            code: 400,
            message: "Can't favorite song without login"
        });
    }
});
exports.favorite = favorite;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songId = req.params.songId;
    const song = yield song_model_1.default.findOne({ _id: songId });
    if (!song) {
        return res.status(404).json({ message: "Song not found" });
    }
    const newListenCount = song.listen + 1;
    yield song_model_1.default.updateOne({ _id: songId }, { listen: newListenCount });
    const songNew = yield song_model_1.default.findOne({ _id: songId });
    res.status(200).json({
        code: 200,
        message: "Listen count updated successfully",
        listen: songNew.listen,
    });
});
exports.listen = listen;
