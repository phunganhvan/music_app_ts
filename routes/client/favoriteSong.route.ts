import {Router} from "express";
const router = Router();

import * as controller from '../../controllers/client/favoriteSong.controller';

router.get("/", controller.index);

export const favoriteSongRouter = router;