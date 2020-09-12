import { Request, Response, NextFunction } from 'express';
import { IResponsePattern, patternError } from '../../models/express.model';
import Sensor from '../../schemas/sensor.schema';

class SensorGuard {

  public async isFromThing(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const sensor = await Sensor.findById(request.params.sensorId);

      if (!sensor) {
        return response.status(404).send(patternError(undefined, 'Sensor not found'));
      }

      if (!sensor.isFromThing(request.params.thingId)) {
        return response.status(401).send(patternError(undefined, 'Not authorized'));
      }

      request.storeData = sensor.store;

      return next();
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

}
export default new SensorGuard();
