import { Router, Request, Response } from 'express';
const router: Router = Router();
import * as controller from '../../controllers/client/song.controller';

router.get('/:slugTopic', controller.listSongsByTopic);

export const SongRoute: Router = router;