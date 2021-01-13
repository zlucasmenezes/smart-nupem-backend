import { Request, Response } from 'express';
import { IResponsePattern, patternError, patternResponse } from '../models/express.model';
import { IRelay } from '../models/relay.model';
import Relay from '../schemas/relay.schema';
import { SocketIO } from '../socket-io';

class RelayController {
  public async create(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const relay = new Relay(request.body as IRelay);
      relay.thing = request.params.thingId;
      const createdRelay = await relay.save();

      return response.status(201).send(patternResponse(createdRelay, 'Relay created'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async find(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const relays: IRelay[] = await Relay.findByThingAndPopulate(request.params.thingId);
      return response.status(200).send(patternResponse(relays));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const relay = (await Relay.findByIdAndPopulate(request.params.relayId)) as IRelay;
      return response.status(200).send(patternResponse(relay));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const relay = await Relay.findById(request.params.relayId);
      const updatedRelay = request.body as IRelay;

      if (!relay) {
        return response.status(404).send(patternError(undefined, 'Relay not found'));
      }

      relay.upcomingChanges = {
        name: updatedRelay.name,
        pin: updatedRelay.pin,
        button: updatedRelay.button,
        store: updatedRelay.store,
        nc: updatedRelay.nc,
      };
      const updated = await relay.save();

      SocketIO.sendInRoom(`thing:${request.params.thingId}`, 'upcoming_changes', { id: request.params.thingId });

      return response.status(200).send(patternResponse(updated, 'Relay updated'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const deleted = await Relay.deleteOne({ _id: request.params.relayId });

      return response.status(200).send(patternResponse(deleted, 'Relay deleted'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}

export default new RelayController();
