import dayjs from 'dayjs';
import Relay from '../schemas/relay.schema';
import TS from '../schemas/ts.schema';
import { SocketIO } from '../socket-io';

export class RelayUtils {

  public static async updateAll(thingId: string, value?: boolean): Promise<void> {
    const relays = await Relay.findByThingAndPopulate(thingId);

    relays.forEach(async (relay) => {
      const today = dayjs().startOf('day').toDate();
      const ts = dayjs().toDate().getTime();

      if (relay.store) {
        await TS.updateOne(
          {
            thing: thingId,
            relay: relay._id,
            n: { $lt: 200 },
            day: today
          },
          {
            $push: {
              values: {
                value,
                timestamp: ts
              }
            },
            $min: { first: ts },
            $max: { last: ts },
            $inc: { n: 1 }
          },
          {
            upsert: true
          }
        );
      }

      SocketIO.sendInRoom(`thing:${thingId}`, relay._id, { ts, value });
    });
  }
}
