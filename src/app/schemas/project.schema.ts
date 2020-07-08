import { model, Schema, Model } from 'mongoose';
import { IProject, IProjectPopulated } from '../models/project.model';

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
    },
    description: {
      type: String,
      default: null
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    privacy: {
      type: String,
      required: true
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  {
    timestamps: true
  }
);

ProjectSchema.statics.findByIdAndPopulate = async function(this: IProjectModel, id: string) {
  console.log(id);
  return this.findById(id).populate('admin').populate('users').exec();
};

ProjectSchema.statics.findAndPopulate = async function(this: IProjectModel) {
  return this.find().populate('admin').populate('users').exec();
};

const Project: IProjectModel = model<IProject, IProjectModel>('Project', ProjectSchema, 'projects');
export default Project;

interface IProjectModel extends Model<IProject> {
  findByIdAndPopulate(projectId: string): Promise<IProjectPopulated>;
  findAndPopulate(): Promise<IProjectPopulated[]>;
}
