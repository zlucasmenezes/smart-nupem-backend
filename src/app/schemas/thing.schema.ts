import { model, Model, Schema } from 'mongoose';
import { IProject } from '../models/project.model';
import { IThing, IThingPopulated } from '../models/thing.model';

const ThingSchema = new Schema<IThing>(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 64,
    },
    type: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 64,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ThingSchema.methods.isFromProject = function (this: IThing, projectId: IProject['_id']): boolean {
  // tslint:disable-next-line: triple-equals
  return this.project == projectId;
};

ThingSchema.statics.findByIdAndPopulate = async function (this: IThingModel, thingId: string) {
  return this.findById(thingId)
    .populate({
      path: 'project',
      model: 'Project',
      populate: [
        {
          path: 'users',
          model: 'User',
        },
        {
          path: 'admin',
          model: 'User',
        },
      ],
    })
    .exec();
};

ThingSchema.statics.findByProjectAndPopulate = async function (this: IThingModel, projectId: string) {
  return this.find({ project: projectId })
    .populate({
      path: 'project',
      model: 'Project',
      populate: [
        {
          path: 'users',
          model: 'User',
        },
        {
          path: 'admin',
          model: 'User',
        },
      ],
    })
    .exec();
};

ThingSchema.statics.findByProject = async function (this: IThingModel, projectId: string) {
  return this.find({ project: projectId });
};

ThingSchema.statics.getTypes = async function (this: IThingModel, projectId: string) {
  const types = await this.find({ project: projectId }, { _id: false, type: true }).lean().exec();
  return [...new Set(types.map((type: { type: string }) => type.type))];
};

const Thing: IThingModel = model<IThing, IThingModel>('Thing', ThingSchema, 'things');
export default Thing;

interface IThingModel extends Model<IThing> {
  findByIdAndPopulate(thingId: string): Promise<IThingPopulated>;
  findByProjectAndPopulate(projectId: string): Promise<IThingPopulated[]>;
  findByProject(projectId: string): Promise<IThing[]>;
  getTypes(projectId: string): Promise<string[]>;
}
