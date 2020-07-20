import { Router } from 'express';
import sensorTypeController from '../controllers/sensor-type.controller';
import authGuard from '../middleware/guards/auth.guard';

const routes = Router();

routes.post('/', authGuard.isAuthenticated, sensorTypeController.create);
routes.get('/', authGuard.isAuthenticated, sensorTypeController.find);
routes.get('/:id', authGuard.isAuthenticated, sensorTypeController.findOne);
routes.put('/:id', authGuard.isAuthenticated, sensorTypeController.update);
routes.delete('/:id', authGuard.isAuthenticated, sensorTypeController.delete);

export default routes;
