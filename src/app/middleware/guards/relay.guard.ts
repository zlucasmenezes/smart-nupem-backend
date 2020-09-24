import { NextFunction, Request, Response } from 'express';
import { IResponsePattern, patternError } from '../../models/express.model';
import Relay from '../../schemas/relay.schema';

class RelayGuard {
  public async isFromThing(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const relay = await Relay.findById(request.params.relayId);

      if (!relay) {
        return response.status(404).send(patternError(undefined, 'Relay not found'));
      }

      if (!relay.isFromThing(request.params.thingId)) {
        return response.status(401).send(patternError(undefined, 'Not authorized'));
      }

      request.storeData = relay.store;

      return next();
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}
export default new RelayGuard();
