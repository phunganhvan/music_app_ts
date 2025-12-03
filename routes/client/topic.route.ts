import { Router, Request, Response } from 'express';
const router: Router = Router();
import Topic from '../../models/topic.model';
import * as controller from '../../controllers/client/topic.controller';

router.get('/', controller.topics);

export const TopicRoute: Router = router;