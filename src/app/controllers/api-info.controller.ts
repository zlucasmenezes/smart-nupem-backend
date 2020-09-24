import { Request, Response } from 'express';
import { environment } from '../../environments/environment';
import { IResponsePattern, patternError, patternResponse } from '../models/express.model';

class ApiInfoController {
  public async generalInfo(_: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const apiInfo: IApiInfo = {
        environment: process.env.environment as string,
        title: environment.name,
        version: environment.version,
      };

      return response.status(200).send(patternResponse(apiInfo));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}

export default new ApiInfoController();

interface IApiInfo {
  environment: string;
  title: string;
  version: string;
}
