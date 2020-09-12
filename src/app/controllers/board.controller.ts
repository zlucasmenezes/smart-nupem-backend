import { IBoard, IBoardDevices } from '../models/board.model';
import { Request, Response } from 'express';
import Board from '../schemas/board.schema';
import Thing from '../schemas/thing.schema';
import { IResponsePattern, patternResponse, patternError } from '../models/express.model';
import { EmailService } from '../services/email.service';
import { environment } from '../../environments/environment';
import { EmailTemplate } from '../utils/email-template';
import { IThingPopulated } from '../models/thing.model';
import Sensor from '../schemas/sensor.schema';
import Relay from '../schemas/relay.schema';

class BoardController {

    public async create(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const thing: IThingPopulated = await Thing.findByIdAndPopulate(request.params.thingId);
            const board: IBoard = await Board.createBoard(thing._id);

            EmailService.send(
                environment.smtp.email.default,
                [thing.project.admin.getEmail()],
                'New board credentials',
                EmailTemplate.boardCredentials(thing.project.admin, board, thing)
            ).catch(console.error);

            return response.status(200).send(patternResponse(board, 'Board authentication credentials created'));
        }
        catch (error) {
            return response.status(401).send(patternError(error, error.message));
        }
    }

    public async auth(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const encodedToken = await Board.generateAuthToken(request.body.board, request.body.password);
            return response.status(200).send(patternResponse(encodedToken, 'Board authenticated'));
        }
        catch (error) {
            return response.status(401).send(patternError(error, error.message));
        }
    }

    public async getDevices(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const sensors = (await Sensor.findByThingAndPopulate(request.boardToken.boardId));
            const relays = (await Relay.findByThingAndPopulate(request.boardToken.boardId));

            const devices: IBoardDevices = {
                sensors: sensors.map((sensor) => {
                    return {
                        sensor: sensor._id,
                        type: sensor.type.type,
                        input: sensor.type.input,
                        pin: sensor.pin,
                        pollTime: sensor.pollTime
                    };
                }),
                relays: relays.map((relay) => {
                    return {
                        relay: relay._id,
                        pin: relay.pin
                    };
                })
            };
            return response.status(200).send(patternResponse(devices));
        }
        catch (error) {
            return response.status(401).send(patternError(error, error.message));
        }
    }
}

export default new BoardController();
