import { IBase } from './base.model';
import { IThing, IThingPopulated } from './thing.model';

export interface IRelayPopulated extends IRelay {
  thing: IThingPopulated;
}
export interface IRelay extends IRelaySchema {
  name: string;
  thing: IThing['_id'];
  pin: number;
  button: number;
  store: boolean;
  nc: boolean;
  upcomingChanges: IRelayChanges;
}
interface IRelayChanges {
  name: string;
  pin: number;
  button: number;
  store: boolean;
  nc: boolean;
}
export interface IRelaySchema extends IBase {
  isFromThing(thingId: IThing['_id']): boolean;
}
