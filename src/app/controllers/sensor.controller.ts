import { Request, Response } from 'express';
import { IResponsePattern, patternResponse, patternError } from '../models/express.model';
import Sensor from '../schemas/sensor.schema';
import { ISensor } from '../models/sensor.model';

class SensorController {

    public async create(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const sensor = new Sensor(request.body as ISensor);
        const createdSensor = await sensor.save();

        return response.status(201).send(patternResponse(createdSensor, 'Sensor created'));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async find(_: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const sensors: ISensor[] = await Sensor.find();
        return response.status(200).send(patternResponse(sensors));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const sensor = await Sensor.findById(request.params.id) as ISensor;
        return response.status(200).send(patternResponse(sensor));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const sensor = await Sensor.findById(request.params.id);
        const updatedSensor = request.body as ISensor;

        if (!sensor) { return response.status(404).send(patternError(undefined, 'Sensor not found')); }

        sensor.pin = updatedSensor.pin;
        sensor.pollTime = updatedSensor.pollTime;
        sensor.store = updatedSensor.store;
        sensor.decimalPlaces = updatedSensor.decimalPlaces;
        const updated = await sensor.save();

        return response.status(200).send(patternResponse(updated, 'Sensor updated'));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const deleted = await Sensor.deleteOne({ _id: request.params.id });

            return response.status(200).send(patternResponse(deleted, 'Sensor deleted'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }
}

export default new SensorController();
