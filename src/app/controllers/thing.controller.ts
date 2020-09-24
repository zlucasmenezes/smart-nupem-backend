import { NextFunction, Request, Response } from 'express';
import { IResponsePattern, patternError, patternResponse } from '../models/express.model';
import { IThing, IThingPopulated } from '../models/thing.model';
import Relay from '../schemas/relay.schema';
import Sensor from '../schemas/sensor.schema';
import Thing from '../schemas/thing.schema';
import { SocketIO } from './../socket-io';

class ThingController {
  public async create(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const thing = new Thing(request.body as IThing);
      thing.project = request.params.projectId;

      const createdThing = await thing.save();
      request.params.thingId = createdThing._id;

      return next();
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async find(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const fetchedThings = await Thing.findByProjectAndPopulate(request.params.projectId);
      const things: Partial<IThingPopulated>[] = [];

      for (const fetchedThing of fetchedThings) {
        const thing: Partial<IThingPopulated> = {
          _id: fetchedThing._id,
          name: fetchedThing.name,
          type: fetchedThing.type,
          project: fetchedThing.project,
          sensors: await Sensor.findByThingAndPopulate(fetchedThing._id),
          relays: await Relay.findByThingAndPopulate(fetchedThing._id),
          createdAt: fetchedThing.createdAt,
          updatedAt: fetchedThing.updatedAt,
        };
        things.push(thing);
      }
      return response.status(200).send(patternResponse(things));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const fetchedThing: IThingPopulated = (await Thing.findByIdAndPopulate(request.params.thingId)) as IThingPopulated;

      const thing: Partial<IThingPopulated> = {
        _id: fetchedThing._id,
        name: fetchedThing.name,
        type: fetchedThing.type,
        project: fetchedThing.project,
        sensors: await Sensor.findByThingAndPopulate(fetchedThing._id),
        relays: await Relay.findByThingAndPopulate(fetchedThing._id),
        createdAt: fetchedThing.createdAt,
        updatedAt: fetchedThing.updatedAt,
      };

      return response.status(200).send(patternResponse(thing));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async getBoardStatus(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const boardStatus = {
        board: request.params.thingId,
        status: SocketIO.isBoardConnected(request.params.thingId),
      };

      return response.status(200).send(patternResponse(boardStatus));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async getTypes(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const types: string[] = (await Thing.getTypes(request.params.projectId)) as string[];
      return response.status(200).send(patternResponse(types));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const thing = await Thing.findById(request.params.thingId);
      const updatedThing = request.body as IThing;

      if (!thing) {
        return response.status(404).send(patternError(undefined, 'Thing not found'));
      }

      thing.name = updatedThing.name;
      thing.type = updatedThing.type;
      const updated = await thing.save();

      return response.status(200).send(patternResponse(updated, 'Thing updated'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const deleted = await Thing.deleteOne({ _id: request.params.thingId });

      return response.status(200).send(patternResponse(deleted, 'Thing deleted'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}

export default new ThingController();
