import { Router } from 'express';
import apiController from '../controllers/api-info.controller';

const routes = Router();

routes.get('/', apiController.generalInfo);

export default routes;
