import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { environment } from '../../../environments/environment';
import { IResponsePattern, patternError } from '../../models/express.model';
import Board from '../../schemas/board.schema';
import { IBoardDecodedToken } from '../../models/board.model';
import Thing from '../../schemas/thing.schema';

class BoardGuard {

  public async isAuthenticated(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const boardToken = request.headers.authorization?.split(' ')[1];
      if (!boardToken) { return response.status(401).send(patternError(undefined, 'Not authenticated')); }

      request.boardToken = jwt.verify(boardToken, environment.authentication.board) as IBoardDecodedToken;

      return BoardGuard.exists(request, response, next);
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  private static async exists(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const board = await Board.findById(request.boardToken.boardId);
      if (!board) { return response.status(404).send(patternError(undefined, 'Board not found')); }

      const thing = await Thing.findByIdAndPopulate(request.boardToken.boardId);
      if (!thing) { return response.status(404).send(patternError(undefined, 'Thing not found')); }

      request.params.projectId = thing.project._id;
      request.params.thingId = thing._id;

      return next();
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

}
export default new BoardGuard();
