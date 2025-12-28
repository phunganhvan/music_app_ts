import e, { Router } from 'express';
const router: Router = Router();
import multer from 'multer';
import * as controller from '../../controllers/admin/upload.controller';
import * as uploadToCloud from '../../middlewares/admin/uploadToCloud.middlewares';
const upload = multer();
router.post(
    '/',
    upload.single('file'),
    uploadToCloud.uploadSingle,
    controller.index
);

export const UploadRoutes = router;