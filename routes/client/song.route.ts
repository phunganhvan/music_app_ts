import { Router, Request, Response } from 'express';
const router: Router = Router();
import * as controller from '../../controllers/client/song.controller';

router.get('/:slugTopic', controller.listSongsByTopic);

router.get('/detail/:slugSong', controller.detail)

router.patch('/like/:typeLike/:songId', controller.like);

export const SongRoute: Router = router;