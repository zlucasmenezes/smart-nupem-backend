import { Request, Response } from 'express';
import { environment } from '../../environments/environment';
import { IBoard, IBoardDevices } from '../models/board.model';
import { IResponsePattern, patternError, patternResponse } from '../models/express.model';
import { IThingPopulated } from '../models/thing.model';
import Board from '../schemas/board.schema';
import Relay from '../schemas/relay.schema';
import Sensor from '../schemas/sensor.schema';
import Thing from '../schemas/thing.schema';
import { EmailService } from '../services/email.service';
import { SocketIO } from '../socket-io';
import { EmailTemplateUtils } from '../utils/email-template-utils';

class BoardController {
  public async create(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const thing: IThingPopulated = await Thing.findByIdAndPopulate(request.params.thingId);
      const board: IBoard = await Board.createBoard(thing._id);

      EmailService.send(
        environment.smtp.email.default,
        [thing.project.admin.getEmail()],
        'New board credentials',
        EmailTemplateUtils.boardCredentials(thing.project.admin, board, thing)
      ).catch(console.error);

      return response.status(200).send(patternResponse(board, 'Board authentication credentials created'));
    } catch (error) {
      return response.status(401).send(patternError(error, error.message));
    }
  }

  public async auth(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const encodedToken = await Board.generateAuthToken(request.body.board, request.body.password);
      return response.status(200).send(patternResponse(encodedToken, 'Board authenticated'));
    } catch (error) {
      return response.status(401).send(patternError(error, error.message));
    }
  }

  public async getDevices(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const sensors = await Sensor.findByThingAndPopulate(request.boardToken.boardId);
      const relays = await Relay.findByThingAndPopulate(request.boardToken.boardId);

      const devices: IBoardDevices = {
        sensors: sensors.map(sensor => {
          return {
            sensor: sensor._id,
            type: sensor.type.type,
            library: sensor.type.library,
            input: sensor.type.input,
            pin: sensor.pin,
            pollTime: sensor.pollTime,
          };
        }),
        relays: relays.map(relay => {
          return {
            relay: relay._id,
            pin: relay.pin,
            nc: relay.nc,
            button: relay.button,
          };
        }),
      };
      return response.status(200).send(patternResponse(devices));
    } catch (error) {
      return response.status(401).send(patternError(error, error.message));
    }
  }

  public async updateDevicesUpcomingChanges(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      SocketIO.sendInRoom(`board:${request.params.thingId}`, 'update_devices', null);

      if (!request.upcomingChanges.updatedSuccessfully) {
        throw new Error(request.upcomingChanges.statusMessage);
      }

      return response.status(200).send(patternResponse(null, request.upcomingChanges.statusMessage));
    } catch (error) {
      return response.status(401).send(patternError(error, error.message));
    }
  }

  public async getBoardCredentials(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const board = await Board.findById(request.params.thingId);

      const boardCredentials = {
        _id: request.params.thingId,
        password: board?.password,
      };

      return response.status(200).send(patternResponse(boardCredentials));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}

export default new BoardController();
