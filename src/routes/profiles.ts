/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { index } from 'controllers/ProfileController';
import ensureAuthenticated from 'middlewares/ensureAuthenticated';
import isAdmin from 'middlewares/isMaster';

const router = Router();

router.use(ensureAuthenticated);
router.get('/', isMaster, index);

export default router;
