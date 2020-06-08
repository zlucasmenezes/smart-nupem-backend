import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { environment } from '../../../environments/environment';
import { ITokenData } from '../../model/user.model';

class AuthGuard {

  public async isAuthenticated(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) { return response.status(401).send('You are not authenticated'); }

      request.token = jwt.verify(token, environment.authentication.key) as ITokenData;

      return next();
    }
    catch (error) {
      return response.status(500).send(error);
    }
  }

}

export default new AuthGuard();
