import { Router } from 'express';
import boardController from '../controllers/board.controller';
import boardGuard from '../middleware/guards/board.guard';
import timeSeriesController from '../controllers/ts.controller';

const routes = Router();

routes.post('/auth', boardController.auth);
routes.get('/device', boardGuard.isAuthenticated, boardController.getDevices);
routes.post('/ts/:sensorId', boardGuard.isAuthenticated, timeSeriesController.insert);

export default routes;
