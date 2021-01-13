import { Request, Response } from 'express';
import { IResponsePattern, patternError, patternResponse } from '../models/express.model';
import { ISensor } from '../models/sensor.model';
import Sensor from '../schemas/sensor.schema';
import { SocketIO } from '../socket-io';

class SensorController {
  public async create(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const sensor = new Sensor(request.body as ISensor);
      sensor.thing = request.params.thingId;
      const createdSensor = await sensor.save();

      return response.status(201).send(patternResponse(createdSensor, 'Sensor created'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async find(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const sensors: ISensor[] = await Sensor.findByThingAndPopulate(request.params.thingId);
      return response.status(200).send(patternResponse(sensors));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const sensor = (await Sensor.findByIdAndPopulate(request.params.sensorId)) as ISensor;
      return response.status(200).send(patternResponse(sensor));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const sensor = await Sensor.findById(request.params.sensorId);
      const updatedSensor = request.body as ISensor;

      if (!sensor) {
        return response.status(404).send(patternError(undefined, 'Sensor not found'));
      }

      sensor.upcomingChanges = {
        name: updatedSensor.name,
        pin: updatedSensor.pin,
        pollTime: updatedSensor.pollTime,
        store: updatedSensor.store,
        config: updatedSensor.config,
        function: updatedSensor.function,
      };
      const updated = await sensor.save();

      SocketIO.sendInRoom(`thing:${request.params.thingId}`, 'upcoming_changes', { id: request.params.thingId });

      return response.status(200).send(patternResponse(updated, 'Sensor updated'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const deleted = await Sensor.deleteOne({ _id: request.params.sensorId });

      return response.status(200).send(patternResponse(deleted, 'Sensor deleted'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}

export default new SensorController();
