import { Router } from 'express';
import boardController from '../controllers/board.controller';

const routes = Router();

routes.post('/auth', boardController.auth);

export default routes;
