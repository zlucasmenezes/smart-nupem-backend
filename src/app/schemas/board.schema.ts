import * as jwt from 'jsonwebtoken';
import { model, Model, Schema } from 'mongoose';
import { environment } from '../../environments/environment';
import { IBoard, IBoardDecodedToken, IBoardEncodedToken } from '../models/board.model';
import { IThing } from '../models/thing.model';
import { PasswordUtils } from '../utils/password-utils';

const BoardSchema = new Schema<IBoard>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Thing',
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

BoardSchema.statics.generateAuthToken = async function (this: IBoardModel, boardId: string, password: string): Promise<IBoardEncodedToken> {
  const board = await this.findById(boardId);
  if (!board) {
    return Promise.reject(new Error('Board not found'));
  }

  if (board.password !== password) {
    return Promise.reject(new Error('Invalid authentication credentials'));
  }

  const decodedTokenData: IBoardDecodedToken = { boardId: board._id };

  const encodedTokenData: IBoardEncodedToken = {
    boardId: decodedTokenData.boardId,
    token: jwt.sign(decodedTokenData, environment.authentication.board),
  };

  return Promise.resolve<IBoardEncodedToken>(encodedTokenData);
};

BoardSchema.statics.createBoard = async function (this: IBoardModel, thing: IThing['_id']): Promise<IBoard> {
  try {
    const board = new Board({ _id: thing, password: PasswordUtils.generate(16, 'aA0!') });
    return await board.save();
  } catch (error) {
    throw error;
  }
};

const Board: IBoardModel = model<IBoard, IBoardModel>('Board', BoardSchema, 'boards');
export default Board;

interface IBoardModel extends Model<IBoard> {
  generateAuthToken(boardId: string, password: string): Promise<IBoardEncodedToken>;
  createBoard(thing: IThing['_id']): Promise<IBoard>;
}
