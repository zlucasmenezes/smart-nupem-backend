import { IBase } from './base.model';
import { ISensor } from './sensor.model';
import { IProject } from './project.model';

export interface IThingPopulated extends IBase {
  name: string;
  type: string;
  project: IProject;
  sensors: ISensor[];
}

export interface IThing extends IBase {
  name: string;
  type: string;
  project: IProject['_id'];
  sensors: ISensor['_id'][];
}