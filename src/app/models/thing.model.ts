import { IBase } from './base.model';
import { IProject, IProjectPopulated } from './project.model';
import { IRelayPopulated } from './relay.model';
import { ISensorPopulated } from './sensor.model';

export interface IThingPopulated extends IBase {
  name: string;
  type: string;
  project: IProjectPopulated;
  sensors: ISensorPopulated[];
  relays: IRelayPopulated[];
}

export interface IThing extends IThingSchema {
  name: string;
  type: string;
  project: IProject['_id'];
}

export interface IThingSchema extends IBase {
  isFromProject(projectId: IProject['_id']): boolean;
}
