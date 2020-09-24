import { DocumentQuery, model, Model, Schema } from 'mongoose';
import { IProject, IProjectPopulated } from '../models/project.model';
import { IUser } from '../models/user.model';

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 64,
    },
    description: {
      type: String,
      default: null,
      maxlength: 240,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    privacy: {
      type: String,
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

ProjectSchema.methods.isAdmin = function (this: IProject, userId: IUser['_id']): boolean {
  // tslint:disable-next-line: triple-equals
  return this.admin == userId;
};

ProjectSchema.methods.isUser = function (this: IProject, userId: IUser['_id']): boolean {
  if (this.isAdmin(userId)) {
    return true;
  }

  if (this.privacy === 'public') {
    return true;
  }

  return this.users.some((id: IUser['_id']) => {
    return (id as string) === (userId as string);
  });
};

ProjectSchema.statics.findByIdAndPopulate = async function (this: IProjectModel, projectId: string) {
  return this.findById(projectId).populate('admin').populate('users').exec();
};

ProjectSchema.statics.findByUserAndPopulate = async function (this: IProjectModel, userId: IUser['_id']) {
  return this.find({
    $or: [{ admin: userId }, { users: userId }, { privacy: 'public' }],
  })
    .populate('admin')
    .populate('users')
    .exec();
};

ProjectSchema.statics.findByUser = async function (this: IProjectModel, userId: IUser['_id']) {
  return this.find({
    $or: [{ admin: userId }, { users: userId }, { privacy: 'public' }],
  });
};

const Project: IProjectModel = model<IProject, IProjectModel>('Project', ProjectSchema, 'projects');
export default Project;

interface IProjectModel extends Model<IProject> {
  findByIdAndPopulate(projectId: string): Promise<IProjectPopulated>;
  findByUserAndPopulate(userId: IUser['_id']): Promise<IProjectPopulated[]>;
  findByUser(userId: IUser['_id']): DocumentQuery<IProject[], IProject, {}>;
}
