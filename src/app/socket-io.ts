import { Server as HttpServer } from 'http';
import * as jwt from 'jsonwebtoken';
import SocketIOStatic, { Server, Socket } from 'socket.io';
import { environment } from '../environments/environment';
import { IBoardDecodedToken } from './models/board.model';
import { SocketIOData, SocketIOEvent } from './models/socket-io.model';
import { IDecodedToken } from './models/user.model';
import { RelayUtils } from './utils/relay-utils';
import { SensorUtils } from './utils/sensor-utils';

export class SocketIO {

  private static io: Server;
  static boards = new Set();

  public static start(server: HttpServer): void {
    SocketIO.io = SocketIOStatic.listen(server, {
      pingInterval: 15000,
      pingTimeout: 5000
    });
    SocketIO.middleware();

    SocketIO.io.on('connection', (socket) => {
      const id = socket.request.id;

      if (socket.request.isBoard) {
        console.log(`[IO] Board ${id} connected on ${socket.id}`);
        this.boards.add(id);
        this.sendTo(socket.id, 'board_connected', { id });
        this.sendInRoom(`thing:${id}`, 'board_status', { board: id, status: true });
      } else {
        console.log(`[IO] ${id} connected on ${socket.id}`);
        this.sendTo(socket.id, 'user_connected', { id });
        socket.join(id);
      }

      socket.on('disconnect', () => {
        if (socket.request.isBoard) {
          this.boards.delete(id);
          this.sendInRoom(`thing:${id}`, 'board_status', { board: id, status: false });
          console.log(`[IO] board ${id} disconnected from ${socket.id}`);

          RelayUtils.updateAll(id);
          SensorUtils.updateAll(id);
        } else {
          console.log(`[IO] ${id} disconnected from ${socket.id}`);
        }
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

  public static isBoardConnected(boardId: any): boolean {
    return this.boards.has(boardId);
  }

  private static middleware(): void {
    SocketIO.io.use(async function (socket: Socket, next) {
      try {
        if (socket.handshake.query.user) {
          const userTokenData = await jwt.verify(socket.handshake.query.user, environment.authentication.key) as IDecodedToken;
          socket.request.id = userTokenData.userId;
          socket.request.isBoard = false;
        }
        if (socket.handshake.query.board) {
          const boardTokenData = await jwt.verify(socket.handshake.query.board, environment.authentication.board) as IBoardDecodedToken;
          socket.request.id = boardTokenData.boardId;
          socket.request.isBoard = true;
        }
        next();
      }
      catch (error) {
        next(new Error('Not authorized!'));
      }
    });
  }

}
