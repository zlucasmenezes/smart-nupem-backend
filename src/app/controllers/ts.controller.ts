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
}

export default new TimeSeriesController();
