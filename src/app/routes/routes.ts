import { Router } from 'express';
import apiRoutes from './api-info.routes';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';

export const routes: IRouteConfig[] = [
  { routePath: '/api', childRoutes: apiRoutes},
  { routePath: '/api/users', childRoutes: userRoutes},
  { routePath: '/api/projects', childRoutes: projectRoutes},
];

export interface IRouteConfig {
  routePath: string;
  childRoutes: Router;
}
