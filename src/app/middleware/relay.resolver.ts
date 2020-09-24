import { NextFunction, Request, Response } from 'express';
import { IResponsePattern, patternError } from '../models/express.model';

class RelayResolver {
  public async getValue(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      request.body.value = Boolean(request.body.value);
      next();
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}
export default new RelayResolver();
