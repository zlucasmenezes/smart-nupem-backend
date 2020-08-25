import { Request, Response, NextFunction } from 'express';
import { IResponsePattern, patternError, patternResponse } from '../models/express.model';
import TimeSeries from '../schemas/ts.schema';
import moment from 'moment';

class TimeSeriesController {

  public async insert(request: Request, response: Response<IResponsePattern>, _: NextFunction): Promise<Response | void> {
    try {
      const today = moment().startOf('day').toDate();
      const ts = moment().toDate().getTime();

      const data = await TimeSeries.updateOne(
        {
          thing: request.boardToken.boardId,
          sensor: request.params.sensorId,
          n: { $lt: 200 },
          day: today
        },
        {
          $push: {
            values: {
              value: request.body.value,
              timestamp: ts
            }
          },
          $min: { first: ts },
          $max: { last: ts },
          $inc: { n: 1 }
        },
        {
          upsert: true
        }
      );

      return response.status(201).send(patternResponse(data, 'ts data added'));
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async get(request: Request, response: Response<IResponsePattern>, _: NextFunction): Promise<Response | void> {
    try {
      const data = await TimeSeries.aggregate()
      .match(request.body.matchDay)
      .unwind('values')
      .project({
        _id: false,
        sensor: '$sensor',
        thing: '$thing',
        ts: {
          $toDate: '$values.timestamp'
        },
        value: '$values.value'
      })
      .sort({ ts: 1 })
      .match(request.body.matchMoment);

      return response.status(201).send(patternResponse(data));
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}

export default new TimeSeriesController();
