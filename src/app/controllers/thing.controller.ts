import { Request, Response } from 'express';
import { IResponsePattern, patternResponse, patternError } from '../models/express.model';
import Thing from '../schemas/thing.schema';
import { IThing, IThingPopulated } from '../models/thing.model';

class ThingController {

    public async create(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const thing = new Thing(request.body as IThing);
        thing.project = request.params.projectId;
        const createdThing = await thing.save();

        return response.status(201).send(patternResponse(createdThing, 'Thing created'));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async find(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const things: IThingPopulated[] = await Thing.findByProjectAndPopulate(request.params.projectId);
        return response.status(200).send(patternResponse(things));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const thing: IThingPopulated = await Thing.findByIdAndPopulate(request.params.thingId) as IThingPopulated;
        return response.status(200).send(patternResponse(thing));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async getTypes(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const types: string[] = await Thing.getTypes(request.params.projectId) as string[];
        return response.status(200).send(patternResponse(types));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const thing = await Thing.findById(request.params.thingId);
        const updatedThing = request.body as IThing;

        if (!thing) { return response.status(404).send(patternError(undefined, 'Thing not found')); }

        thing.name = updatedThing.name;
        thing.type = updatedThing.type;
        const updated = await thing.save();

        return response.status(200).send(patternResponse(updated, 'Thing updated'));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const deleted = await Thing.deleteOne({ _id: request.params.thingId });

            return response.status(200).send(patternResponse(deleted, 'Thing deleted'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }
}

export default new ThingController();
