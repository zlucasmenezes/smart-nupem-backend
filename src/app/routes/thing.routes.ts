import { Router } from 'express';
import thingController from '../controllers/thing.controller';
import authGuard from '../middleware/guards/auth.guard';
import projectGuard from '../middleware/guards/project.guard';
import thingGuard from '../middleware/guards/thing.guard';

const routes = Router();

routes.post('/:projectId', authGuard.isAuthenticated, projectGuard.isAdmin, thingController.create);
routes.get('/:projectId', authGuard.isAuthenticated, projectGuard.isUser, thingController.find);
routes.get('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isUser, thingGuard.isFromProject, thingController.findOne);
routes.put('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isAdmin, thingGuard.isFromProject, thingController.update);
routes.delete('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isAdmin, thingGuard.isFromProject, thingController.delete);

export default routes;
