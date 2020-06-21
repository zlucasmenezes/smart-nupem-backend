import { IUser } from './user.model';

export type SocketIOEvent = 'user_connected' | 'user_disconnected';
export type SocketIOData = IUser | { _id: string};
