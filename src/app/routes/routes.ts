import { Router } from 'express';
import apiRoutes from './api-info.routes';

export const routes: IRouteConfig[] = [
  { routePath: '/api', childRoutes: apiRoutes},
];

export interface IRouteConfig {
  routePath: string;
  childRoutes: Router;
}
