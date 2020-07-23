import { Router } from 'express';
import projectController from '../controllers/project.controller';
import authGuard from '../middleware/guards/auth.guard';
import projectGuard from '../middleware/guards/project.guard';

const routes = Router();

routes.post('/', authGuard.isAuthenticated, projectController.create);
routes.get('/', authGuard.isAuthenticated, projectController.find);
routes.get('/:projectId', authGuard.isAuthenticated, projectGuard.isUser, projectController.findOne);
routes.put('/:projectId', authGuard.isAuthenticated, projectGuard.isAdmin, projectController.update);
routes.delete('/:projectId', authGuard.isAuthenticated, projectGuard.isAdmin, projectController.delete);

export default routes;
