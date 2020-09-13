export type SocketIOEvent =
'user_connected' |
'user_disconnected' |
string;

export type SocketIOData =
{ id: string} |
{ ts?: number, value: any };
