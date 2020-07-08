import { IBase } from './base.model';
import { IUser } from './user.model';

export interface IProjectPopulated extends IProject {
  admin: IUser;
  users: IUser[];
}

export interface IProject extends IBase {
  name: string;
  description: string;
  privacy: Privacy;
  admin: IUser['_id'];
  users: IUser['_id'][];
}

export type Privacy = 'private' | 'public';
