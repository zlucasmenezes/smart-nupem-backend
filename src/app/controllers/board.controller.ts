import { Request, Response } from 'express';
import Board from '../schemas/board.schema';
import Thing from '../schemas/thing.schema';
import { IResponsePattern, patternResponse, patternError } from '../models/express.model';
import { EmailService } from '../services/email.service';
import { environment } from '../../environments/environment';
import { EmailTemplate } from '../utils/email-template';
import { IBoard } from '../models/board.model';
import { IThingPopulated } from '../models/thing.model';

class BoardController {

    public async create(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const thing: IThingPopulated = await Thing.findByIdAndPopulate(request.params.thingId);
            const board: IBoard = await Board.createBoard(thing._id);

            EmailService.send(
                environment.smtp.email.default,
                [thing.project.admin.email],
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

    public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const board = await Board.findById(request.params.boardId);
            const updatedBoard = request.body;

            if (!board) { return response.status(404).send(patternError(undefined, 'Board not found')); }

            board.password = updatedBoard.password;
            const updated = await board.save();

            return response.status(200).send(patternResponse(updated, 'Board updated'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }

    public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const deleted = await Board.deleteOne({ _id: request.params.boardId });

            return response.status(200).send(patternResponse(deleted, 'Board deleted'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }
}

export default new BoardController();
