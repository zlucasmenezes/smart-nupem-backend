import { Router } from 'express';
import apiRoutes from './api-info.routes';
import userRoutes from './user.routes';

export const routes: IRouteConfig[] = [
  { routePath: '/api', childRoutes: apiRoutes},
  { routePath: '/api/users', childRoutes: userRoutes},
];

export interface IRouteConfig {
  routePath: string;
  childRoutes: Router;
}
