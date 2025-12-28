import { Router } from 'express';
import multer from 'multer';
const router: Router = Router();
import * as controller from '../../controllers/admin/song.controller';

import * as uploadToCloud from '../../middlewares/admin/uploadToCloud.middlewares';

import * as validate from '../../validates/admin/create.validate';
const upload = multer();

router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
    '/create',
    upload.fields([{ name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 }]),
    uploadToCloud.uploadFields,
    validate.createPost,
    controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.fields([{ name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 }]),
    uploadToCloud.uploadFields,
    validate.editPatch,
    controller.editPatch);
export const SongRoutes = router;