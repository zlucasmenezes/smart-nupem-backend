import { IBase } from './base.model';
import { IThing } from './thing.model';
import { InputType } from './sensor.model';

export interface IBoardDevices {
  sensors: IBoardSensor[];
}

interface IBoardSensor {
  sensor: string;
  type: string;
  input: InputType;
  pin: number;
  pollTime: number;
}

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
