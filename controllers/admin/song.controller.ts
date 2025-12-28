import { Request, Response } from 'express';
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';
import Topic from '../../models/topic.model';
import { systemConfig } from '../../config/config';


export const index = async (req: Request, res: Response): Promise<void> => {
    const songs = await Song.find({
        deleted: false,
    }).select('title avatar slug singerId like topicId status');

    for (let song of songs) {
        const singerInfo = await Singer.find({
            _id: song.singerId,
            status: "active",
            deleted: false,
        }).select('fullName slug');
        song["singerInfo"] = singerInfo;

        const topic = await Topic.find({
            _id: song.topicId,
            status: "active",
            deleted: false
        }).select('title slug');
        song["topicInfo"] = topic;

    }
    res.render('admin/pages/song/index', {
        pageTitle: "Quản lý bài hát",
        songs: songs
    })
};

export const create = async (req: Request, res: Response): Promise<void> => {
    const topic = await Topic.find({
        deleted: false,
        status: "active"
    }).select('title');
    const singer = await Singer.find({
        deleted: false,
        status: "active"
    }).select('fullName');
    res.render('admin/pages/song/create', {
        pageTitle: "Thêm mới bài hát",
        topics: topic,
        singers: singer
    })
}

export const createPost = async (req: Request, res: Response): Promise<void> => {
    // console.log(req.body);
    const lengthData = await Song.countDocuments({
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
    }
    const song = new Song(dataSongObject);
    await song.save();
    req.flash("success", "Thêm mới bài hát thành công");
    res.redirect(`${systemConfig.prefixAdmin}/song`);
}

export const edit = async (req: Request, res: Response): Promise<void> => {
    const songId = req.params.id;
    const song = await Song.findOne({
        _id: songId,
        deleted: false,
    });
    const topic = await Topic.find({
        deleted: false,
        status: "active"
    }).select('title');
    const singer = await Singer.find({
        deleted: false,
        status: "active"
    }).select('fullName');
    res.render('admin/pages/song/edit', {
        pageTitle: "Chỉnh sửa bài hát",
        song: song,
        topics: topic,
        singers: singer
    })
}

export const editPatch = async (req: Request, res: Response): Promise<void> => {
    const songId = req.params.id;
    const song = await Song.findOne({
        _id: songId,
        deleted: false,
    });
    
    if (!song) {
        req.flash("error", "Bài hát không tồn tại");
        return res.redirect(`${systemConfig.prefixAdmin}/song`);
    }
    // console.log(req.body);
    const lengthData = await Song.countDocuments({
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
    }
    if (req.body.audio) {
        dataSongObject["audio"] = req.body.audio[0];
    }
    if (req.body.avatar) {
        dataSongObject["avatar"] = req.body.avatar[0];
    }
    await Song.updateOne({_id: songId}, dataSongObject);
    req.flash("success", "Cập nhật bài hát thành công");
    res.redirect(`${systemConfig.prefixAdmin}/song`);
    // await song.save();
    // req.flash("success", "Cập nhật bài hát thành công");
    // res.redirect(`${systemConfig.prefixAdmin}/song`);
}