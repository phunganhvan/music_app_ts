import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

export const result = async (req: Request, res: Response) => {
    const type= req.params.type;
    const keyword = req.query.keyword as string || '';
    // Logic tìm kiếm bài hát, nghệ sĩ, album dựa trên từ khóa
    // Ví dụ: Tìm kiếm trong cơ sở dữ liệu
    // const songs = await Song.find({ title: { $regex: keyword, $options: 'i' } });
    let newSong = [];

    if(keyword){
        const keywordRegex = new RegExp(keyword, 'i');
        const stringSlug = convertToSlug(keyword);
        const slugRegex = new RegExp(stringSlug, 'i');
        const songs = await Song.find({
            $or: [
                { title: { $regex: keywordRegex } },
                { slug: { $regex: slugRegex } },
            ],
            deleted: false,
        });
        // console.log(songs);
        

        for (const song of songs) {
            const infoSinger = await Singer.findOne({
                _id: song.singerId,
                deleted: false,
            });
            if (infoSinger) {
                song['singerInfo'] = infoSinger;
            }
            newSong.push({
                id: song.id,
                title: song.title,
                slug: song.slug,
                like: song.like,
                avatar: song.avatar,
                singerInfo: {
                    fullName: infoSinger.fullName,
                },
            })
        }
    }

    switch (type) {
        case 'suggest':
            res.status(200).json({
                code: 200,
                message: 'Gợi ý tìm kiếm',
                songs: newSong,
            });
            break;
        case 'result':
            res.render('client/pages/search/result', {
                pageTitle: `Kết quả tìm kiếm cho "${keyword}"`,
                keyword: keyword,
                songs: newSong,
                // listSongs: songs,
            });
            break;
        default: 
            res.status(404).send('Page not found');
            break;
    }

}

