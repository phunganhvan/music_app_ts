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
exports.index = void 0;
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    const favoriteSongs = yield favorite_song_model_1.default.find({
        userId: userId,
        deleted: false,
    }).select("songId createdAt");
    const songIds = favoriteSongs.map(fav => fav.songId);
    const songs = yield song_model_1.default.find({
        _id: { $in: songIds },
        status: "active",
        deleted: false,
    }).select("title avatar slug singerId like");
    for (let song of songs) {
        const singerInfo = yield singer_model_1.default.find({
            _id: song.singerId,
            status: "active",
            deleted: false,
        });
        const favoriteSong = yield favorite_song_model_1.default.findOne({
            songId: song._id.toString(),
            userId: req.cookies.userId,
        });
        song["isFavorite"] = favoriteSong ? true : false;
        song["singerInfo"] = singerInfo;
        song["addedAt"] = favoriteSong.createdAt;
    }
    res.render("client/pages/favoriteSong/index", {
        pageTitle: "Bài hát yêu thích",
        songs: songs,
    });
});
exports.index = index;
