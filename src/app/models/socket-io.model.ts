import { IBoardStatus } from './thing.model';

export type SocketIOEvent = 'user_connected' | 'user_disconnected' | 'board_connected' | 'board_status' | string;

export type SocketIOData = { id: string } | { ts: number; value: any } | { relay: string; value: boolean } | IBoardStatus;
