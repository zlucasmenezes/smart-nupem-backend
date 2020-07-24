import { Router } from 'express';
import sensorController from '../controllers/sensor.controller';
import authGuard from '../middleware/guards/auth.guard';
import projectGuard from '../middleware/guards/project.guard';
import thingGuard from '../middleware/guards/thing.guard';
import sensorGuard from '../middleware/guards/sensor.guard';

const routes = Router();

routes.post('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isAdmin, thingGuard.isFromProject, sensorController.create);
routes.get('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isUser, thingGuard.isFromProject, sensorController.find);
routes.get(
  '/:projectId/:thingId/:sensorId',
  authGuard.isAuthenticated, projectGuard.isUser, thingGuard.isFromProject, sensorGuard.isFromThing, sensorController.findOne
);
routes.put(
  '/:projectId/:thingId/:sensorId',
  authGuard.isAuthenticated, projectGuard.isAdmin, thingGuard.isFromProject, sensorGuard.isFromThing, sensorController.update
);
routes.delete(
  '/:projectId/:thingId/:sensorId',
  authGuard.isAuthenticated, projectGuard.isAdmin, thingGuard.isFromProject, sensorGuard.isFromThing, sensorController.delete
);

export default routes;
