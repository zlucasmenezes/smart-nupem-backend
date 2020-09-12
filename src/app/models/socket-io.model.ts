export type SocketIOEvent =
'user_connected' |
'user_disconnected' |
string;

export type SocketIOData =
{ userId: string} |
{ ts: number, value: any };
