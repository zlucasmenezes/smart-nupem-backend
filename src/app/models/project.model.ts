import { IBase } from './base.model';
import { IUser } from './user.model';
import { IThing } from './thing.model';

export interface IProjectPopulated extends IProject {
  admin: IUser;
  users: IUser[];
  things: IThing[];
}

export interface IProject extends IProjectSchema {
  name: string;
  description: string;
  privacy: Privacy;
  admin: IUser['_id'];
  users: IUser['_id'][];
}

export interface IProjectSchema extends IBase {
  isAdmin(userId: IUser['_id']): boolean;
  isUser(userId: IUser['_id']): boolean;
}

export type Privacy = 'private' | 'public';
