/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { store, recoveryPassword, resetPassword } from 'controllers/SessionController';

const router = Router();

router.post('/', store);
router.post('/recoverypassword', recoveryPassword);
router.post('/resetpassword', resetPassword);

export default router;
