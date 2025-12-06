import { json, Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
// [GET] /songs/:slugTopic
export const listSongsByTopic = async (req: Request, res: Response) => {
    // const list = await SongRoute.find({
    //     topicSlug: req.params.slugTopic,
    // });

    const topic = await Topic.findOne({
        slug: req.params.slugTopic,
        status: "active",
        deleted: false,
    });
    if (!topic) {
        res.redirect("/");
    }
    // console.log(req.params.slugTopic);
    const songs = await Song.find({
        topicId: topic._id.toString(),
        status: "active",
        deleted: false,
    }).select("title avatar slug singerId like");

    for (let song of songs) {
        const singerInfo = await Singer.find({
            _id: song.singerId,
            status: "active",
            deleted: false,
        })
        song["singerInfo"] = singerInfo;
    }
    res.render("client/pages/songs/index", {
        pageTitle: topic.title,
        songs: songs,
        // listSong: list,
    });
}

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
    const song = await Song.findOne({
        slug: req.params.slugSong,
        status: "active",
        deleted: false,
    });
    // thông tin bài hát
    if (!song) {
        res.redirect("/");
    }
    const singerInfo = await Singer.find({
        _id: song.singerId,
        status: "active",
        deleted: false,
    });

    // thông tin ca sĩ
    const topic = await Topic.findOne({
        _id: song.topicId,
        status: "active",
        deleted: false,
    });
    // thông tin chủ đề

    song["singerName"] = singerInfo[0].fullName;
    song["topicTitle"] = topic.title;
    res.render("client/pages/songs/detail", {
        pageTitle: song.title,
        song: song,
        singerInfo: singerInfo,
        topic: topic,
    });
}

// [GET] /songs/like/:typeLike/:songId
export const like = async (req: Request, res: Response) => {
    const songId = req.params.songId;
    const typeLike = req.params.typeLike;
    const song = await Song.findById(songId);
    if (!song) {
        return res.status(404).json({ message: "Song not found" });
    }
    
    const newLikeCount: number = typeLike === "yes" ? song.like + 1 : song.like - 1;
    await Song.updateOne({
        _id: songId,
    }, {
        like: newLikeCount,
    });
    
    res.status(200).json({
        code: 200, 
        message: "Liked successfully",
        like: newLikeCount,
    });
}