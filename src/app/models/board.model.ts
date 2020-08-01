import { IBase } from './base.model';
import { IThing } from './thing.model';

export interface IBoard extends IBase {
  _id: IThing['_id'];
  password: string;
}

export interface IBoardDecodedToken {
  boardId: IBoard['_id'];
  iat?: number;
  exp?: number;
}

export interface IBoardEncodedToken extends IBoardDecodedToken {
  token: string;
}
