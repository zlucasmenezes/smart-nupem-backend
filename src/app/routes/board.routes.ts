import { Router } from 'express';
import boardController from '../controllers/board.controller';
import tsController from '../controllers/ts.controller';
import boardGuard from '../middleware/guards/board.guard';
import relayGuard from '../middleware/guards/relay.guard';
import sensorGuard from '../middleware/guards/sensor.guard';
import relayResolver from '../middleware/relay.resolver';
import sensorResolver from '../middleware/sensor.resolver';

const routes = Router();

routes.post('/auth', boardGuard.isConnected, boardController.auth);
routes.get('/devices', boardGuard.isAuthenticated, boardController.getDevices);
routes.post('/ts/sensor/:sensorId', boardGuard.isAuthenticated, sensorGuard.isFromThing, sensorResolver.getValue, tsController.insert);
routes.post('/ts/relay/:relayId', boardGuard.isAuthenticated, relayGuard.isFromThing, relayResolver.getValue, tsController.insert);

export default routes;
