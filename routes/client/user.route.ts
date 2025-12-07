import { Router, Request, Response } from 'express';
import md5 from 'md5';
const router: Router = Router();
import * as controller from '../../controllers/client/user.controller';
import * as validate from '../../validates/client/user.validate'
router.get('/register', controller.register);

router.post('/register', validate.registerPost ,controller.postRegister);

router.get('/login', controller.login);

router.post('/login', validate.loginPost ,controller.postLogin);

router.get('/logout', controller.logout);

router.get('/password/forgot', controller.forgotPassword);

router.post('/password/forgot', validate.forgotPasswordPost ,controller.postForgotPassword);

// nhập otp
router.get('/password/otp', controller.otpPassword);

router.post('/password/otp' ,controller.postOtpPassword);

// reset password
router.get('/password/reset', controller.resetPassword);
router.post('/password/reset', validate.resetPasswordPost ,controller.postResetPassword);   

export const UserRoute: Router = router;
