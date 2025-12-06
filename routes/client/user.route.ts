import { Router, Request, Response } from 'express';
import md5 from 'md5';
const router: Router = Router();
import * as controller from '../../controllers/client/user.controller';
import * as validate from '../../validates/client/user.validate'
router.get('/register', controller.register);

router.post('/register', validate.registerPost ,controller.postRegister);

router.get('/login', controller.login);
export const UserRoute: Router = router;