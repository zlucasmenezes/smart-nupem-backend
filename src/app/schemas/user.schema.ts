import { model, Schema, HookNextFunction, Model } from 'mongoose';
import { IUser, IDecodedToken, IEncodedToken } from '../models/user.model';
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
    timestamps: true,
    toJSON: { virtuals: true }
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

UserSchema.statics.generateAuthToken = async function (this: IUserModel, username: string, password: string): Promise<IEncodedToken> {
  const user = await this.findOne({ username});
  if (!user) { return Promise.reject(new Error('User not found')); }

  if (!await bcrypt.compare(password, user.password)) { return Promise.reject(new Error('Invalid authentication credentials')); }

  const decodedTokenData: IDecodedToken = {
    userId: user._id,
  };

  const encodedTokenData: IEncodedToken = {
    userId: decodedTokenData.userId,
    token: jwt.sign(decodedTokenData, environment.authentication.key, environment.authentication.options),
    exp: Math.floor(Date.now() / 1000) + Number(environment.authentication.options.expiresIn)
  };

  return Promise.resolve<IEncodedToken>(encodedTokenData);
};

const User: IUserModel = model<IUser, IUserModel>('User', UserSchema, 'users');
export default User;

interface IUserModel extends Model<IUser> {
  generateAuthToken(username: string, password: string): Promise<IEncodedToken>;
}
