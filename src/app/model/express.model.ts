import { ITokenData } from './user.model';

declare global {
  namespace Express {
    // tslint:disable-next-line: interface-name
    interface Request {
      token: ITokenData;
    }
  }
}
