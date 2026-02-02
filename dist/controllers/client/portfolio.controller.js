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
    const user = res.locals.user;
    const favoriteSongs = yield favorite_song_model_1.default.find({
        userId: user.id,
        deleted: false,
    }).select("songId createdAt");
    const songIds = favoriteSongs.map(fav => fav.songId);
    const songs = yield song_model_1.default.find({
        _id: { $in: songIds },
        status: "active",
        deleted: false,
    }).select("title avatar slug singerId like listen");
    for (let song of songs) {
        const singerInfo = yield singer_model_1.default.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false,
        }).select("fullName avatar");
        const favoriteSong = favoriteSongs.find(fav => fav.songId === song._id.toString());
        song["singerInfo"] = singerInfo;
        song["addedAt"] = favoriteSong === null || favoriteSong === void 0 ? void 0 : favoriteSong.createdAt;
    }
    const totalSongs = songs.length;
    const totalLikes = songs.reduce((sum, song) => sum + (song.like || 0), 0);
    const totalListens = songs.reduce((sum, song) => sum + (song.listen || 0), 0);
    res.render("client/pages/portfolio/index", {
        pageTitle: "Portfolio - " + user.fullName,
        songs: songs,
        stats: {
            totalSongs,
            totalLikes,
            totalListens
        }
    });
});
exports.index = index;
