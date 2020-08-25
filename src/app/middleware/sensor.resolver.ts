import { Request, Response, NextFunction } from 'express';
import Sensor from '../schemas/sensor.schema';
import { IResponsePattern, patternError } from '../models/express.model';
import { isNumber } from 'util';

class SensorResolver {

  public async getValue(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const sensor = await Sensor.findByIdAndPopulate(request.params.sensorId);

      if (sensor.function) {
        const sensorFunction = new Function('value', 'resolution', sensor.function);

        const value = sensorFunction(request.body.value, request.body.resolution);
        request.body.value = isNaN(value) ? value : Number(value.toFixed(1));

      } else if (sensor.type.function) {
        const configParams: string[] = sensor.type.config.map((config) => config.parameter);
        const sensorFunction = new Function(...configParams, 'value', 'resolution', sensor.type.function);

        const configParamsValues = configParams.map((param) => sensor.config.find((c) => c.parameter === param)?.value);

        const value = sensorFunction(...configParamsValues, request.body.value, request.body.resolution);
        request.body.value = isNumber(value) ? Number(value.toFixed(1)) : value;
      }

      next();
    }
    catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

}
export default new SensorResolver();
