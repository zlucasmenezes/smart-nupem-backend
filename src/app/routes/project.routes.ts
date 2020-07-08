import { Router } from 'express';
import projectController from '../controllers/project.controller';
import authGuard from '../middleware/guards/auth.guard';

const routes = Router();

routes.post('/', authGuard.isAuthenticated, authGuard.exists, projectController.create);
routes.get('/', authGuard.isAuthenticated, authGuard.exists, projectController.find);
routes.get('/:id', authGuard.isAuthenticated, authGuard.exists, projectController.findOne);
routes.put('/:id', authGuard.isAuthenticated, authGuard.exists, projectController.update);
routes.delete('/:id', authGuard.isAuthenticated, authGuard.exists, projectController.delete);

export default routes;
