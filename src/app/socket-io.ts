import { IBoardDecodedToken } from './models/board.model';
import { Server as HttpServer } from 'http';
import * as jwt from 'jsonwebtoken';
import SocketIOStatic, { Server, Socket } from 'socket.io';
import { environment } from '../environments/environment';
import { IDecodedToken } from './models/user.model';
import { SocketIOData, SocketIOEvent } from './models/socket-io.model';

export class SocketIO {

  private static io: Server;

  public static start(server: HttpServer): void {
    SocketIO.io = SocketIOStatic.listen(server);
    SocketIO.middleware();

    SocketIO.io.on('connection', (socket) => {
      const id = socket.request.id;

      console.log(`[IO] ${id} connected on ${socket.id}`);
      this.sendTo(socket.id, 'user_connected', { id });
      socket.join(id);

      socket.on('disconnect', () => {
        console.log(`[IO] ${id} disconnected from ${socket.id}`);
      });

      socket.on('join_room', (room) => {
        console.log(`[IO] ${id} joining room ${room}`);
        socket.join(room);
      });

      socket.on('leave_room', (room) => {
        console.log(`[IO] ${id} leaving room ${room}`);
        socket.leave(room);
      });
    });
  }

  public static broadcast(event: SocketIOEvent, data: SocketIOData): void {
    SocketIO.io.emit(event, data);
  }

  public static sendTo(userId: string, event: SocketIOEvent, data: SocketIOData): void {
    SocketIO.io.to(userId).emit(event, data);
  }

  public static sendInRoom(room: string, event: SocketIOEvent, data: SocketIOData): void {
    SocketIO.io.in(room).emit(event, data);
  }

  private static middleware(): void {
    SocketIO.io.use(async function (socket: Socket, next) {
      try {
        if (socket.handshake.query.user) {
          const userTokenData = await jwt.verify(socket.handshake.query.user, environment.authentication.key) as IDecodedToken;
          socket.request.id = userTokenData.userId;
        }
        if (socket.handshake.query.board) {
          const boardTokenData = await jwt.verify(socket.handshake.query.board, environment.authentication.board) as IBoardDecodedToken;
          socket.request.id = boardTokenData.boardId;
        }
        next();
      }
      catch (error) {
        next(new Error('Not authorized!'));
      }
    });
  }

}
