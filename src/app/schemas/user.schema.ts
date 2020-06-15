import { model, Schema, HookNextFunction, Model } from 'mongoose';
import { IUser, ITokenData } from '../models/user.model';
import { environment } from '../../environments/environment';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 4,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 4,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      minlength: 4,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    }
  },
  {
    timestamps: true
  }
);

UserSchema.virtual('fullName').get(
  function(this: IUser): string {
    return `${this.firstName} ${this.lastName}`;
  }
);

UserSchema.pre<IUser>('save', async function (this: IUser, next: HookNextFunction) {
  if (this.isModified('password')) {
    if (this.isNew) {
      this.password = await bcrypt.hash(this.password, await bcrypt.genSalt());
      next();
    }
  }
});

UserSchema.statics.generateAuthToken = async function (this: IUserModel, username: string, password: string): Promise<string> {
  const user = await this.findOne({ username});
  if (!user) { return Promise.reject(new Error('User not found')); }

  if (!await bcrypt.compare(password, user.password)) { return Promise.reject(new Error('Invalid authentication credentials')); }

  const tokenData: ITokenData = {
    userId: user._id,
  };

  const token = jwt.sign(
    tokenData,
    environment.authentication.key,
    environment.authentication.options
  );

  return Promise.resolve<string>(token);
};

const User: IUserModel = model<IUser, IUserModel>('User', UserSchema, 'users');
export default User;

interface IUserModel extends Model<IUser> {
  generateAuthToken(username: string, password: string): Promise<string>;
}
