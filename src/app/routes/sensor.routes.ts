import { Router } from 'express';
import sensorController from '../controllers/sensor.controller';
import authGuard from '../middleware/guards/auth.guard';
import projectGuard from '../middleware/guards/project.guard';
import thingGuard from '../middleware/guards/thing.guard';
import sensorGuard from '../middleware/guards/sensor.guard';
import tsController from '../controllers/ts.controller';
import tsResolver from '../middleware/ts.resolver';

const routes = Router({ mergeParams: true });

routes.post('/', authGuard.isAuthenticated, projectGuard.isAdmin, thingGuard.isFromProject, sensorController.create);
routes.get('/', authGuard.isAuthenticated, projectGuard.isUser, thingGuard.isFromProject, sensorController.find);
routes.get('/:sensorId/ts', authGuard.isAuthenticated, projectGuard.isUser, thingGuard.isFromProject, sensorGuard.isFromThing, tsResolver.matchDatesQuery, tsController.get);
routes.get('/:sensorId', authGuard.isAuthenticated, projectGuard.isUser, thingGuard.isFromProject, sensorGuard.isFromThing, sensorController.findOne);
routes.put('/:sensorId', authGuard.isAuthenticated, projectGuard.isAdmin, thingGuard.isFromProject, sensorGuard.isFromThing, sensorController.update);
routes.delete('/:sensorId', authGuard.isAuthenticated, projectGuard.isAdmin, thingGuard.isFromProject, sensorGuard.isFromThing, sensorController.delete);

export default routes;
