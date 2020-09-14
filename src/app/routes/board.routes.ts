import { Router } from 'express';
import boardController from '../controllers/board.controller';
import boardGuard from '../middleware/guards/board.guard';
import tsController from '../controllers/ts.controller';
import sensorGuard from '../middleware/guards/sensor.guard';
import sensorResolver from '../middleware/sensor.resolver';
import relayGuard from '../middleware/guards/relay.guard';

const routes = Router();

routes.post('/auth', boardController.auth);
routes.get('/devices', boardGuard.isAuthenticated, boardController.getDevices);
routes.post('/ts/sensor/:sensorId', boardGuard.isAuthenticated, sensorGuard.isFromThing, sensorResolver.getValue, tsController.insert);
routes.post('/ts/relay/:relayId', boardGuard.isAuthenticated, relayGuard.isFromThing, tsController.insert);

export default routes;
