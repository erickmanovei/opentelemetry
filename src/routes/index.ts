import { Router } from 'express';
import sessions from './sessions';
import users from './users';
import profiles from './profiles';

const routes = Router();

routes.use('/session', sessions);
routes.use('/users', users);
routes.use('/profiles', profiles);

export default routes;
