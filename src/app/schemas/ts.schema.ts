import { model, Schema, Model } from 'mongoose';
import { ITS } from '../models/ts.model';

const TSSchema = new Schema<ITS>(
  {
    thing: {
      type: Schema.Types.ObjectId,
      ref: 'Thing',
      required: true
    },
    sensor: {
      type: Schema.Types.ObjectId,
      ref: 'Sensor',
      required: true
    },
    n: {
      type: Number,
      required: true,
      min: 0,
      max: 200
    },
    day: {
      type: Date,
      required: true
    },
    first: {
      type: Number,
      required: true,
    },
    last: {
      type: Number,
      required: true,
    },
    values: [{
      _id: false,
      timestamp: {
        type: Number,
        required: true
      },
      value: {
        type: Schema.Types.Mixed,
        required: true,
      },
    }],
  }
);

const TS: ITSModel = model<ITS, ITSModel>('TS', TSSchema, 'ts');
export default TS;

interface ITSModel extends Model<ITS> {
}
