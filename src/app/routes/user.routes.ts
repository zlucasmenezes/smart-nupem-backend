import { Router } from 'express';
import userController from '../controllers/user.controller';
import authGuard from '../middleware/guards/auth.guard';

const routes = Router();

routes.post('/auth/signup', userController.signup);
routes.post('/auth/login', userController.login);
routes.get('/', authGuard.isAuthenticated, userController.find);
routes.get('/:id', authGuard.isAuthenticated, userController.findOne);
routes.put('/:id', authGuard.isAuthenticated, userController.update);
routes.delete('/:id', authGuard.isAuthenticated, userController.delete);

export default routes;
