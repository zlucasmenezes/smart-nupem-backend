import { Router } from 'express';
import thingController from '../controllers/thing.controller';
import authGuard from '../middleware/guards/auth.guard';

const routes = Router();

routes.post('/', authGuard.isAuthenticated, thingController.create);
routes.get('/', authGuard.isAuthenticated, thingController.find);
routes.get('/:id', authGuard.isAuthenticated, thingController.findOne);
routes.put('/:id', authGuard.isAuthenticated, thingController.update);
routes.delete('/:id', authGuard.isAuthenticated, thingController.delete);

export default routes;
