import { Router, Request, Response } from 'express';
import md5 from 'md5';
const router: Router = Router();
import * as controller from '../../controllers/client/user.controller';

router.get('/register', controller.register);

export const UserRoute: Router = router;