import dayjs from 'dayjs';
import Sensor from '../schemas/sensor.schema';
import TS from '../schemas/ts.schema';
import { SocketIO } from '../socket-io';

export class SensorUtils {
  public static async updateAll(thingId: string, value?: any): Promise<void> {
    const sensors = await Sensor.findByThingAndPopulate(thingId);

    sensors.forEach(async sensor => {
      const today = dayjs().startOf('day').toDate();
      const ts = dayjs().toDate().getTime();

      if (sensor.store) {
        await TS.updateOne(
          {
            thing: thingId,
            sensor: sensor._id,
            n: { $lt: 200 },
            day: today,
          },
          {
            $push: {
              values: {
                value,
                timestamp: ts,
              },
            },
            $min: { first: ts },
            $max: { last: ts },
            $inc: { n: 1 },
          },
          {
            upsert: true,
          }
        );
      }

      SocketIO.sendInRoom(`thing:${thingId}`, sensor._id, { ts, value });
    });
  }
}
