import { Router } from 'express';
import boardController from '../controllers/board.controller';
import boardGuard from '../middleware/guards/board.guard';

const routes = Router();

routes.post('/auth', boardController.auth);
routes.get('/device', boardGuard.isAuthenticated, boardController.getDevices);

export default routes;
