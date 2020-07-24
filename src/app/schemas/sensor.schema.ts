import { model, Schema, Model } from 'mongoose';
import { ISensor, ISensorPopulated } from '../models/sensor.model';

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
    thing: {
      type: Schema.Types.ObjectId,
      ref: 'Thing',
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

SensorSchema.statics.findByIdAndPopulate = async function(this: ISensorModel, sensorId: string) {
  return this.findById(sensorId).populate([
    {
      path: 'thing',
      model: 'Thing',
      populate: {
        path:  'project',
        model: 'Project',
        populate: [
          {
            path:  'users',
            model: 'User',
          },
          {
            path:  'admin',
            model: 'User',
          }
        ]
      }
    },
    {
      path: 'type',
      model: 'SensorType',
    }
  ]).exec();
};

SensorSchema.statics.findByThingAndPopulate = async function(this: ISensorModel, thingId: string) {
  return this.find({ thing: thingId }).populate([
    {
      path: 'thing',
      model: 'Thing',
      populate: {
        path:  'project',
        model: 'Project',
        populate: [
          {
            path:  'users',
            model: 'User',
          },
          {
            path:  'admin',
            model: 'User',
          }
        ]
      }
    },
    {
      path: 'type',
      model: 'SensorType',
    }
  ]).exec();
};

const Sensor: ISensorModel = model<ISensor, ISensorModel>('Sensor', SensorSchema, 'sensors');
export default Sensor;

interface ISensorModel extends Model<ISensor> {
  findByIdAndPopulate(sensorId: string): Promise<ISensorPopulated>;
  findByThingAndPopulate(thingId: string): Promise<ISensorPopulated[]>;
}
