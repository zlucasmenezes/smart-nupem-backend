import { model, Schema, Model } from 'mongoose';
import { ISensor } from '../models/sensor.model';

const SensorSchema = new Schema<ISensor>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 64
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'SensorType',
      required: true
    },
    pin: {
      type: Number,
      required: true,
      min: 1
    },
    pollTime: {
      type: Number,
      required: true,
      min: 1000,
    },
    store: {
      type: Boolean,
      required: true,
    },
    function: {
      type: String,
      default: null
    },
    config: [{
      _id: false,
      parameter: {
        type: String,
        required: true,
        maxlength: 64
      },
      value: {
        type: Number,
        required: true,
      },
    }],
  },
  {
    timestamps: true
  }
);

const Sensor: ISensorModel = model<ISensor, ISensorModel>('Sensor', SensorSchema, 'sensors');
export default Sensor;

interface ISensorModel extends Model<ISensor> {

}
