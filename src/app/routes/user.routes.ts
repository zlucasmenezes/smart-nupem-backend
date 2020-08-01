import { Router } from 'express';
import userController from '../controllers/user.controller';
import authGuard from '../middleware/guards/auth.guard';

const routes = Router();

routes.post('/auth/signup', userController.signup);
routes.post('/auth/login', userController.login);
routes.get('/', authGuard.isAuthenticated, userController.find);
routes.get('/:userId', authGuard.isAuthenticated, userController.findOne);
routes.put('/:userId', authGuard.isAuthenticated, authGuard.isHimSelf, userController.update);
routes.delete('/:userId', authGuard.isAuthenticated, authGuard.isHimSelf, userController.delete);

export default routes;
