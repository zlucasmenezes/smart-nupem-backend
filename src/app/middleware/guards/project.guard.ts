import { Request, Response, NextFunction } from 'express';
import { IResponsePattern, patternError } from '../../models/express.model';
import Project from '../../schemas/project.schema';

class ProjectGuard {

  public async isAdmin(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const project = await Project.findById(request.params.projectId);

      if (!project) {
        return response.status(404).send(patternError(undefined, 'Project not found'));
      }

      if (!project.isAdmin(request.token.userId)) {
        return response.status(401).send(patternError(undefined, 'Not authorized'));
      }

      return next();
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async isUser(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const project = await Project.findById(request.params.projectId);

      if (!project) {
        return response.status(404).send(patternError(undefined, 'Project not found'));
      }

      if (!project.isUser(request.token.userId)) {
        return response.status(401).send(patternError(undefined, 'Not authorized'));
      }

      return next();
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

}
export default new ProjectGuard();
