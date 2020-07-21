import { IBase } from './base.model';

export interface ISensor extends IBase {
  name: string;
  type: ISensorType['_id'];
  pin: number;
  pollTime: number;
  store: boolean;
  decimalPlaces: number;
  function: string;
  config: ISensorParameters[];
}

export interface ISensorType extends IBase {
  type: string;
  input: InputType;
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
