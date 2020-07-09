import { model, Schema, Model } from 'mongoose';
import { IProject, IProjectPopulated } from '../models/project.model';
import { IUser } from '../models/user.model';

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

ProjectSchema.methods.isAdmin = function(this: IProject, userId: IUser['_id']): boolean {
  // tslint:disable-next-line: triple-equals
  return this.admin == userId;
};

ProjectSchema.methods.isUser = function(this: IProject, userId: IUser['_id']): boolean {
  if (this.isAdmin(userId)) { return true; }

  return this.users.some((id: IUser['_id']) => {
    // tslint:disable-next-line: triple-equals
    return id == userId;
  });
};

ProjectSchema.statics.findByIdAndPopulate = async function(this: IProjectModel, id: string) {
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
