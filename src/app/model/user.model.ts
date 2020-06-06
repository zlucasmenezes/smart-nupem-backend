import { IBase } from './base.model';

interface IUserSchema extends IBase {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends IUserSchema {
  fullName: string;
}
