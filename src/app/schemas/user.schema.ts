import { model, Schema, HookNextFunction, Model } from 'mongoose';
import { IUser, ITokenData } from '../model/user.model';
import { environment } from './../../environments/environment';
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
  function(): string {
    return `${this.firstName} ${this.lastName}`;
  }
);

UserSchema.pre<IUser>('save', async function (next: HookNextFunction) {
  if (this.isModified('password')) {
    if (this.isNew) {
      this.password = await bcrypt.hash(this.password, await bcrypt.genSalt());
      next();
    }
  }
});

UserSchema.statics.generateAuthToken = async function (username: string, password: string): Promise<string> {
  const user: IUser = await this.findOne({ username});
  if (!await bcrypt.compare(password, user.password)) { return Promise.reject('Password incorrect'); }

  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
    } as ITokenData,
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
