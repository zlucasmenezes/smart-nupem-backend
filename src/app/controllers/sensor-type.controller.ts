import { Request, Response } from 'express';
import { IResponsePattern, patternResponse, patternError } from '../models/express.model';
import SensorType from '../schemas/sensor-type.schema';
import { ISensorType } from '../models/sensor.model';

class SensorTypeController {

    public async create(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const sensorType = new SensorType(request.body as ISensorType);
        const createdSensorType = await sensorType.save();

        return response.status(201).send(patternResponse(createdSensorType, 'Sensor Type created'));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async find(_: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const sensorTypes: ISensorType[] = await SensorType.find();
        return response.status(200).send(patternResponse(sensorTypes));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const sensorType = await SensorType.findById(request.params.sensorId) as ISensorType;
        return response.status(200).send(patternResponse(sensorType));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const sensorType = await SensorType.findById(request.params.sensorId);
        const updatedSensorType = request.body as ISensorType;

        if (!sensorType) { return response.status(404).send(patternError(undefined, 'Sensor Type not found')); }

        sensorType.type = updatedSensorType.type;
        sensorType.config = updatedSensorType.config;
        sensorType.function = updatedSensorType.function;
        sensorType.input = updatedSensorType.input;
        const updated = await sensorType.save();

        return response.status(200).send(patternResponse(updated, 'Sensor Type updated'));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const deleted = await SensorType.deleteOne({ _id: request.params.sensorId });

            return response.status(200).send(patternResponse(deleted, 'Sensor Type deleted'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }
}

export default new SensorTypeController();
