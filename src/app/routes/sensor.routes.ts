import { Router } from 'express';
import sensorController from '../controllers/sensor.controller';
import authGuard from '../middleware/guards/auth.guard';
import projectGuard from '../middleware/guards/project.guard';

const routes = Router();

routes.post('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isAdmin, sensorController.create);
routes.get('/:projectId/:thingId', authGuard.isAuthenticated, projectGuard.isUser, sensorController.find);
routes.get('/:projectId/:thingId/:sensorId', authGuard.isAuthenticated, projectGuard.isUser, sensorController.findOne);
routes.put('/:projectId/:thingId/:sensorId', authGuard.isAuthenticated, projectGuard.isAdmin, sensorController.update);
routes.delete('/:projectId/:thingId/:sensorId', authGuard.isAuthenticated, projectGuard.isAdmin, sensorController.delete);

export default routes;
