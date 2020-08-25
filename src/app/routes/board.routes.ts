import { Router } from 'express';
import boardController from '../controllers/board.controller';
import boardGuard from '../middleware/guards/board.guard';
import timeSeriesController from '../controllers/ts.controller';
import sensorGuard from '../middleware/guards/sensor.guard';
import sensorResolver from '../middleware/sensor.resolver';

const routes = Router();

routes.post('/auth', boardController.auth);
routes.get('/devices', boardGuard.isAuthenticated, boardController.getDevices);
routes.post('/ts/:sensorId', boardGuard.isAuthenticated, sensorGuard.isFromThing, sensorResolver.getValue, timeSeriesController.insert);

export default routes;
