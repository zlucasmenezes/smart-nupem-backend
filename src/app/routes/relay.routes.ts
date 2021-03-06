import { Router } from 'express';
import relayController from '../controllers/relay.controller';
import tsController from '../controllers/ts.controller';
import authGuard from '../middleware/guards/auth.guard';
import projectGuard from '../middleware/guards/project.guard';
import relayGuard from '../middleware/guards/relay.guard';
import thingGuard from '../middleware/guards/thing.guard';
import tsResolver from '../middleware/ts.resolver';

const routes = Router({ mergeParams: true });

routes.post('/', authGuard.isAuthenticated, projectGuard.isAdmin, thingGuard.isFromProject, relayController.create);
routes.post(
  '/:relayId/ts',
  authGuard.isAuthenticated,
  projectGuard.isUser,
  thingGuard.isFromProject,
  relayGuard.isFromThing,
  tsController.insert
);
routes.get('/', authGuard.isAuthenticated, projectGuard.isUser, thingGuard.isFromProject, relayController.find);
routes.get(
  '/:relayId/ts',
  authGuard.isAuthenticated,
  projectGuard.isUser,
  thingGuard.isFromProject,
  relayGuard.isFromThing,
  tsResolver.matchDatesQuery,
  tsController.get
);
routes.get(
  '/:relayId/ts/download',
  authGuard.isAuthenticated,
  projectGuard.isUser,
  thingGuard.isFromProject,
  relayGuard.isFromThing,
  tsResolver.matchDatesQuery,
  tsController.download
);
routes.get(
  '/:relayId/value',
  authGuard.isAuthenticated,
  projectGuard.isUser,
  thingGuard.isFromProject,
  relayGuard.isFromThing,
  tsController.getCurrentValue
);
routes.get(
  '/:relayId',
  authGuard.isAuthenticated,
  projectGuard.isUser,
  thingGuard.isFromProject,
  relayGuard.isFromThing,
  relayController.findOne
);
routes.put(
  '/:relayId',
  authGuard.isAuthenticated,
  projectGuard.isAdmin,
  thingGuard.isFromProject,
  relayGuard.isFromThing,
  relayController.update
);
routes.patch(
  '/:relayId/discardUpcomingChanges',
  authGuard.isAuthenticated,
  projectGuard.isAdmin,
  thingGuard.isFromProject,
  relayGuard.isFromThing,
  relayController.discardUpcomingChanges
);
routes.delete(
  '/:relayId',
  authGuard.isAuthenticated,
  projectGuard.isAdmin,
  thingGuard.isFromProject,
  relayGuard.isFromThing,
  relayController.delete
);

export default routes;
