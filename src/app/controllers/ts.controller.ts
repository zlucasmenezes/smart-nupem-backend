import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { IResponsePattern, patternError, patternResponse } from '../models/express.model';
import TS from '../schemas/ts.schema';
import { SocketIO } from '../socket-io';
import { RouteUtils } from '../utils/route-utils';

class TSController {
  public async insert(request: Request, response: Response<IResponsePattern>, _: NextFunction): Promise<Response | void> {
    try {
      const deviceType = RouteUtils.getDeviceType(request.params);

      const today = dayjs().startOf('day').toDate();
      const ts = dayjs().toDate().getTime();

      let data;

      if (request.storeData) {
        data = await TS.updateOne(
          {
            thing: request.params.thingId,
            [deviceType]: request.params[`${deviceType}Id`],
            n: { $lt: 200 },
            day: today,
          },
          {
            $push: {
              values: {
                value: request.body.value,
                timestamp: ts,
              },
            },
            $min: { first: ts },
            $max: { last: ts },
            $inc: { n: 1 },
          },
          {
            upsert: true,
          }
        );
      }

      SocketIO.sendInRoom(`thing:${request.params.thingId}`, request.params[`${deviceType}Id`], {
        ts,
        value: request.body.value,
      });

      if (deviceType === 'relay') {
        SocketIO.sendInRoom(`board:${request.params.thingId}`, request.params[`${deviceType}Id`], {
          relay: request.params[`${deviceType}Id`],
          value: request.body.value,
        });
      }

      return response.status(201).send(patternResponse(data, 'ts data added'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async get(request: Request, response: Response<IResponsePattern>, _: NextFunction): Promise<Response | void> {
    try {
      const deviceType = RouteUtils.getDeviceType(request.params);

      const data = await TS.aggregate()
        .match(request.body.matchDay)
        .unwind('values')
        .project({
          _id: false,
          [deviceType]: `$${deviceType}`,
          thing: '$thing',
          ts: {
            $toDate: '$values.timestamp',
          },
          value: '$values.value',
        })
        .sort({ ts: 1 })
        .match(request.body.matchMoment);

      return response.status(201).send(patternResponse(data));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async getCurrentValue(request: Request, response: Response<IResponsePattern>, _: NextFunction): Promise<Response | void> {
    try {
      if (!request.storeData) {
        return response.status(201).send(
          patternResponse({
            value: null,
          })
        );
      }

      const deviceType = RouteUtils.getDeviceType(request.params);

      const data = await TS.aggregate()
        .match({ [deviceType]: new Types.ObjectId(request.params[`${deviceType}Id`]) })
        .sort({ last: -1 })
        .limit(1)
        .unwind('values')
        .project({
          _id: false,
          [deviceType]: `$${deviceType}`,
          thing: '$thing',
          ts: {
            $toDate: '$values.timestamp',
          },
          value: '$values.value',
        })
        .sort({ ts: -1 })
        .limit(1);

      return response.status(201).send(patternResponse(data[0]));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}

export default new TSController();
