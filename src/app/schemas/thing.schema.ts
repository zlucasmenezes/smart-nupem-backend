import { model, Schema, Model } from 'mongoose';
import { IThing, IThingPopulated } from '../models/thing.model';

const ThingSchema = new Schema<IThing>(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 64
    },
    type: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 64
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    sensors: [{
      type: Schema.Types.ObjectId,
      ref: 'Sensor'
    }],
  },
  {
    timestamps: true
  }
);

ThingSchema.statics.findByIdAndPopulate = async function(this: IThingModel, id: string) {
  return this.findById(id).populate('project').populate('sensors').exec();
};

ThingSchema.statics.findAndPopulate = async function(this: IThingModel) {
  return this.find().populate('project').populate('sensors').exec();
};

const Thing: IThingModel = model<IThing, IThingModel>('Thing', ThingSchema, 'things');
export default Thing;

interface IThingModel extends Model<IThing> {
  findByIdAndPopulate(thingId: string): Promise<IThingPopulated>;
  findAndPopulate(): Promise<IThingPopulated[]>;
}
