import { IBase } from './base.model';

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

export type InputType = 'Analog' | 'Digital';
