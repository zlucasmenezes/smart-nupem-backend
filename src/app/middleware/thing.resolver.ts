import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { IResponsePattern, patternError } from '../models/express.model';
import { IRelay, IRelaySchema } from '../models/relay.model';
import { ISensor, ISensorSchema } from '../models/sensor.model';
import Relay from '../schemas/relay.schema';
import Sensor from '../schemas/sensor.schema';
import { SocketIO } from '../socket-io';

class ThingResolver {
  public async applyUpcomingChanges(request: Request, response: Response<IResponsePattern>, next: NextFunction): Promise<Response | void> {
    try {
      const sensors = await Sensor.findByThing(request.params.thingId);
      const relays = await Relay.findByThing(request.params.thingId);

      const updates: Promise<IRelay | ISensor>[] = [];

      const updateDevices = (devices: (IRelay | ISensor)[], model: Model<IRelaySchema | ISensorSchema>) => {
        for (const device of devices) {
          if (!device.upcomingChanges) {
            continue;
          }
          updates.push(model.updateOne({ _id: device._id }, { ...device.upcomingChanges, upcomingChanges: null }).exec());
        }
      };
      updateDevices(sensors, Sensor);
      updateDevices(relays, Relay);

      Promise.all(updates)
        .then(devices => {
          const statusMessage = `Upcoming changes applied to ${devices.length} devices`;
          console.log(`[THING] ${request.params.thingId}: ${statusMessage}`);
          request.upcomingChanges = { updatedSuccessfully: true, statusMessage };
        })
        .catch(() => {
          const statusMessage = `Can't apply all upcoming changes`;
          console.log(`[THING] ${request.params.thingId}: ${statusMessage}`);
          request.upcomingChanges = { updatedSuccessfully: false, statusMessage };
        })
        .finally(() => {
          SocketIO.sendInRoom(`thing:${request.params.thingId}`, 'update_devices', null);
          next();
        });
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}
export default new ThingResolver();
