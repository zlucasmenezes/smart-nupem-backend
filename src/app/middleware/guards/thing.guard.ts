import { Request, Response, NextFunction } from 'express';
import { IResponsePattern, patternError } from '../../models/express.model';
import Thing from '../../schemas/thing.schema';

class ThingGuard {

  public async isFromProject(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const thing = await Thing.findById(request.params.projectId);

      if (!thing) {
        return response.status(404).send(patternError(undefined, 'Thing not found'));
      }

      if (!thing.isFromProject(request.params.projectId)) {
        return response.status(401).send(patternError(undefined, 'Not authorized'));
      }

      return next();
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

}
export default new ThingGuard();
