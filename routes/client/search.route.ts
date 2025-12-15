import {Router } from 'express';
const router = Router();

import * as controller from '../../controllers/client/search.controller';
// [GET] /search
router.get('/:type', controller.result);

// suggest or result

export const SearchRoutes : Router = router;