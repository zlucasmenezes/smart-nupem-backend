import { Document } from 'mongoose';

export interface IBase extends Document {
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
