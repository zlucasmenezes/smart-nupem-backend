import { ISensorType } from '../models/sensor.model';
import SensorType from '../schemas/sensor-type.schema';
import { defaultSensorTypes } from '../utils/default-sensor-types';

export async function createDefaultSensorTypes(): Promise<void> {
  return SensorType.insertMany(defaultSensorTypes as ISensorType[], { ordered: false })
    .then(() => {
      return;
    })
    .catch(e => console.error(e.writeErrors.map((writeError: any) => writeError.err.errmsg)));
}
