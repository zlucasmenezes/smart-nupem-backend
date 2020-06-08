import { ITokenData } from './user.model';

// tslint:disable: max-classes-per-file
// tslint:disable: interface-name

declare global {
  namespace Express {
    interface Request {
      token: ITokenData;
    }
  }
}

export interface IResponsePattern {
  message: string;
  error?: any;
  data?: any;
}

export const patternResponse = (
  data: any = { },
  message: string = 'OK'
  ): IResponsePattern => {
  return {
    message,
    data
  };
};

export const patternError = (
  error: any = new Error('An error ocurred'),
  message: string = 'An error ocurred'
  ): IResponsePattern => {
  return {
    message,
    error
  };
};
