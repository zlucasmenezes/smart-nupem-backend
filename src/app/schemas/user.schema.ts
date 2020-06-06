import { model, Schema } from 'mongoose';
import { IUser } from '../model/user.model';

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
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

UserSchema.pre<IUser>('save', function () {
    if (this.isModified('password')) {
      console.log('password modified');
    }
  }
);

const User = model<IUser>('User', UserSchema, 'users');
export default User;
