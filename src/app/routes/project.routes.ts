import { Router } from 'express';
import projectController from '../controllers/project.controller';
import authGuard from '../middleware/guards/auth.guard';
import projectGuard from '../middleware/guards/project.guard';

const routes = Router();

routes.post('/', authGuard.isAuthenticated, projectController.create);
routes.get('/', authGuard.isAuthenticated, projectController.find);
routes.get('/:id', authGuard.isAuthenticated, projectGuard.isUser, projectController.findOne);
routes.put('/:id', authGuard.isAuthenticated, projectGuard.isAdmin, projectController.update);
routes.delete('/:id', authGuard.isAuthenticated, projectGuard.isAdmin, projectController.delete);

export default routes;
