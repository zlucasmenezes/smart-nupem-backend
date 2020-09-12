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
      const userId = socket.request.userId;

      console.log(`[IO] ${userId} connected on ${socket.id}`);
      this.sendTo(socket.id, 'user_connected', { userId });
      socket.join(userId);

      socket.on('disconnect', () => {
        console.log(`[IO] ${userId} disconnected from ${socket.id}`);
      });

      socket.on('join_room', (room) => {
        console.log(`[IO] ${userId} joining room ${room}`);
        socket.join(room);
      });

      socket.on('leave_room', (room) => {
        console.log(`[IO] ${userId} leaving room ${room}`);
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
        const tokenData = await jwt.verify(socket.handshake.query.token, environment.authentication.key) as IDecodedToken;
        socket.request.userId = tokenData.userId;
        next();
      }
      catch (error) {
        next(new Error('Not authorized!'));
      }
    });
  }

}
