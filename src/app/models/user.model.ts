import { IBase } from './base.model';

export interface IUser extends IUserSchema {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

interface IUserSchema extends IBase {
  fullName: string;
}

export interface ITokenData {
  userId: IUser['_id'];
  iat?: number;
  exp?: number;
}
