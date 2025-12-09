import {Request, Response} from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /favorite-songs
export const index = async (req: Request, res: Response) => {
    const userId = req.cookies.userId;
    const favoriteSongs = await FavoriteSong.find({
        userId: userId,
        deleted: false,
    }).select("songId createdAt");    
    const songIds = favoriteSongs.map(fav => fav.songId);
    const songs = await Song.find({
        _id: { $in: songIds },
        status: "active",
        deleted: false,
    }).select("title avatar slug singerId like");
    for (let song of songs) {
        const singerInfo = await Singer.find({
            _id: song.singerId,
            status: "active",
            deleted: false,
        })
        const favoriteSong = await FavoriteSong.findOne({
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
}
