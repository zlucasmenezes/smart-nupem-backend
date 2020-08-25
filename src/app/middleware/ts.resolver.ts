import { Request, Response, NextFunction } from 'express';
import { IResponsePattern, patternError } from '../models/express.model';
import { IMatchDate } from '../models/ts.model';
import moment from 'moment';
import { Types } from 'mongoose';

class TSResolver {

  public async matchDatesQuery(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const day: IMatchDate = { };
      const ts: IMatchDate = { };

      let hasQuery = false;

      if (request.query.start) {
        day.$gte = moment(String(request.query.start)).startOf('day').toDate();
        ts.$gte = moment(String(request.query.start)).toDate();
        hasQuery = true;
      }
      if (request.query.end) {
        day.$lte = moment(String(request.query.end)).startOf('day').toDate();
        ts.$lte = moment(String(request.query.end)).toDate();
        hasQuery = true;
      }

      const matchDay: { sensor: Types.ObjectId, day?: IMatchDate } = {
        sensor: new Types.ObjectId(request.params.sensorId),
      };
      const matchMoment: { ts?: IMatchDate } = { };

      if (hasQuery) {
        matchDay.day = day;
        matchMoment.ts = ts;
      }

      request.body.matchDay = matchDay;
      request.body.matchMoment = matchMoment;

      next();
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

}
export default new TSResolver();
