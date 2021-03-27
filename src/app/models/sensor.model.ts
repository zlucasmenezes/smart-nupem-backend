import { IBase } from './base.model';
import { IThing } from './thing.model';

export interface ISensorPopulated extends ISensor {
  type: ISensorType;
  thing: IThing;
}
export interface ISensor extends ISensorSchema {
  name: string;
  type: ISensorType['_id'];
  thing: IThing['_id'];
  pin: number;
  pollTime: number;
  store: boolean;
  function: string;
  config: ISensorParameters[];
  upcomingChanges: ISensorChanges | null;
}

interface ISensorChanges {
  name: string;
  pin: number;
  pollTime: number;
  store: boolean;
  function: string;
  config: ISensorParameters[];
}

export interface ISensorSchema extends IBase {
  isFromThing(thingId: IThing['_id']): boolean;
}

export interface ISensorType extends IBase {
  type: string;
  input: InputType;
  status: boolean;
  library: number;
  function: string;
  config: ISensorConfig[];
}
export interface ISensorConfig {
  parameter: string;
  description: string;
  default: number;
}

export interface ISensorParameters {
  parameter: string;
  value: number;
}

export type InputType = 'Analog' | 'Digital';
