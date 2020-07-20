import { model, Schema, Model } from 'mongoose';
import { ISensorType } from '../models/sensor.model';

const SensorTypeSchema = new Schema<ISensorType>(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      maxlength: 64
    },
    input: {
      type: String,
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
      description: {
        type: String,
        required: true,
        maxlength: 240
      },
      default: {
        type: Number,
        required: true,
      },
    }],
  },
  {
    timestamps: true
  }
);

const SensorType: ISensorTypeModel = model<ISensorType, ISensorTypeModel>('SensorType', SensorTypeSchema, 'sensorTypes');
export default SensorType;

interface ISensorTypeModel extends Model<ISensorType> {

}
