import { Request, Response } from "express";
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
    if(!topic) {
        res.redirect("/");
    }
    // console.log(req.params.slugTopic);
    const songs = await Song.find({
        topicId: topic._id.toString(),
        status: "active",
        deleted: false,
    }).select("title avatar slug singerId like");

    for( let song of songs ) {
        const singerInfo = await Singer.find({
            _id: song.singerId,
            status: "active",
            deleted: false,
        })
        song["singerInfo"] = singerInfo;
    }
    console.log(songs);
    res.render("client/pages/songs/index", {
        pageTitle: topic.title,
        songs: songs,
        // listSong: list,
    });
}