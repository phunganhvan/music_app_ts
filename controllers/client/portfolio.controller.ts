import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /user/portfolio
export const index = async (req: Request, res: Response) => {
    const user = res.locals.user;
    
    // Get user's favorite songs
    const favoriteSongs = await FavoriteSong.find({
        userId: user.id,
        deleted: false,
    }).select("songId createdAt");
    
    const songIds = favoriteSongs.map(fav => fav.songId);
    
    // Get songs details
    const songs = await Song.find({
        _id: { $in: songIds },
        status: "active",
        deleted: false,
    }).select("title avatar slug singerId like listen");
    
    // Add singer info to each song
    for (let song of songs) {
        const singerInfo = await Singer.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false,
        }).select("fullName avatar");
        
        const favoriteSong = favoriteSongs.find(fav => fav.songId === song._id.toString());
        
        song["singerInfo"] = singerInfo;
        song["addedAt"] = favoriteSong?.createdAt;
    }
    
    // Calculate statistics
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
}
