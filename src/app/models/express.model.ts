import { IBoardDecodedToken } from './board.model';
import { IDecodedToken } from './user.model';

declare global {
  namespace Express {
    // tslint:disable-next-line: interface-name
    interface Request {
      token: IDecodedToken;
      boardToken: IBoardDecodedToken;
      storeData: boolean;
    }
  }
}

export interface IResponsePattern {
  message: string;
  error?: any;
  data?: any;
}

export const patternResponse = (data: any = null, message: string = 'OK'): IResponsePattern => {
  return {
    message,
    data,
  };
};

export const patternError = (error: any = new Error('An error ocurred'), message: string = 'An error ocurred'): IResponsePattern => {
  return {
    message,
    error,
  };
};
