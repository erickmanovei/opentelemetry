import multer from 'multer';
import { Router } from 'express';
import {
  index,
  show,
  store,
  update,
  destroy,
  showMe,
  updateMe,
  emailExists,
} from 'controllers/UserController';
import ensureAuthenticated from 'middlewares/ensureAuthenticated';
import isMaster from 'middlewares/isMaster';
import multerConfig from 'config/upload';

const upload = multer(
  multerConfig({
    storage: 'local',
  }),
);

const router = Router();

router.post('/emailexists', emailExists);
router.use(ensureAuthenticated);
router.get('/me', showMe);
router.get('/', isMaster, index);
router.get('/:id', isMaster, show);
router.post('/', isMaster, store);
router.put('/me', updateMe);
router.put('/:id', isMaster, update);
router.delete('/:id', isMaster, destroy);

export default router;
