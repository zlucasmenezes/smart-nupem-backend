import { Router } from 'express';
import thingController from '../controllers/thing.controller';
import authGuard from '../middleware/guards/auth.guard';
import projectGuard from '../middleware/guards/project.guard';

const routes = Router();

routes.post('/:projectId', authGuard.isAuthenticated, projectGuard.isAdmin, thingController.create);
routes.get('/:projectId', authGuard.isAuthenticated, projectGuard.isUser, thingController.find);
routes.get('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isUser, thingController.findOne);
routes.put('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isAdmin, thingController.update);
routes.delete('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isAdmin, thingController.delete);

export default routes;
