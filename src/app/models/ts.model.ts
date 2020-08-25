import { IBase } from './base.model';
import { ISensor } from './sensor.model';
import { IThing } from './thing.model';

export interface ITS extends IBase {
  thing: IThing['_id'];
  sensor: ISensor['_id'];
  n: number;
  day: Date;
  first: number;
  last: number;
  values: ITSValue[];
}

interface ITSValue {
  timestamp: number;
  value: any;
}

export interface IMatchDate {
  $gte?: Date;
  $lte?: Date;
}
