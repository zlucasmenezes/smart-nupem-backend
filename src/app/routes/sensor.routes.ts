import { Router } from 'express';
import sensorController from '../controllers/sensor.controller';
import authGuard from '../middleware/guards/auth.guard';

const routes = Router();

routes.post('/', authGuard.isAuthenticated, sensorController.create);
routes.get('/', authGuard.isAuthenticated, sensorController.find);
routes.get('/:id', authGuard.isAuthenticated, sensorController.findOne);
routes.put('/:id', authGuard.isAuthenticated, sensorController.update);
routes.delete('/:id', authGuard.isAuthenticated, sensorController.delete);

export default routes;
