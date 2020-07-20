import { Router } from 'express';
import apiRoutes from './api-info.routes';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import sensorTypeRoutes from './sensor-type.routes';

export const routes: IRouteConfig[] = [
  { routePath: '/api', childRoutes: apiRoutes},
  { routePath: '/api/users', childRoutes: userRoutes},
  { routePath: '/api/projects', childRoutes: projectRoutes},
  { routePath: '/api/sensors/types', childRoutes: sensorTypeRoutes},
];

export interface IRouteConfig {
  routePath: string;
  childRoutes: Router;
}
