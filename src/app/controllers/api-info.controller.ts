import { Request, Response } from 'express';
import { environment } from '../../environments/environment';

class ApiInfoController {

    public async generalInfo(_: Request, response: Response): Promise<Response> {
      try {
        const apiInfo: IApiInfo = {
          environment: process.env.environment as string,
          title: environment.name,
          version: environment.version,
        };

        return response.status(200).send(apiInfo);
      }
      catch (error) {
        return response.status(500).send(error.toString());
      }
    }

}

export default new ApiInfoController();

interface IApiInfo {
  environment: string;
  title: string;
  version: string;
}
