import { Router } from 'express';
import apiRoutes from './api-info.routes';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import thingRoutes from './thing.routes';
import sensorRoutes from './sensor.routes';
import sensorTypeRoutes from './sensor-type.routes';
import boardRoutes from './board.routes';

export const routes: IRouteConfig[] = [
  { routePath: '/api', childRoutes: apiRoutes },
  { routePath: '/api/user', childRoutes: userRoutes },
  { routePath: '/api/project', childRoutes: projectRoutes },
  { routePath: '/api/project/:projectId/thing', childRoutes: thingRoutes },
  { routePath: '/api/project/:projectId/thing/:thingId/sensor', childRoutes: sensorRoutes },
  { routePath: '/api/sensortype', childRoutes: sensorTypeRoutes },
  { routePath: '/api/board', childRoutes: boardRoutes },
];

export interface IRouteConfig {
  routePath: string;
  childRoutes: Router;
}
