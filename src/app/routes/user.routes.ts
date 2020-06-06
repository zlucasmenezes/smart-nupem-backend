import { Router } from 'express';
import userController from '../controllers/user.controller';

const routes = Router();

routes.post('/auth/signup', userController.create);
routes.get('/', userController.find);
routes.get('/:id', userController.findOne);
routes.put('/:id', userController.update);
routes.delete('/:id', userController.delete);

export default routes;
