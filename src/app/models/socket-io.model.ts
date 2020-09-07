export type SocketIOEvent =
'user_connected' |
'user_disconnected' |
string;

export type SocketIOData =
{ _id: string} |
{ ts: number, value: any };
