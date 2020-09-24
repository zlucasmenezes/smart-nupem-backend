import { model, Model, Schema } from 'mongoose';
import { IRelay, IRelayPopulated } from '../models/relay.model';
import { IThing } from '../models/thing.model';

const RelaySchema = new Schema<IRelay>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 64,
    },
    thing: {
      type: Schema.Types.ObjectId,
      ref: 'Thing',
      required: true,
    },
    pin: {
      type: Number,
      required: true,
      min: 1,
    },
    button: {
      type: Number,
      min: 1,
      default: null,
    },
    store: {
      type: Boolean,
      required: true,
    },
    nc: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

RelaySchema.methods.isFromThing = function (this: IRelay, thingId: IThing['_id']): boolean {
  return String(this.thing) === String(thingId);
};

RelaySchema.statics.findByIdAndPopulate = async function (this: IRelayModel, relayId: string) {
  return this.findById(relayId)
    .populate([
      {
        path: 'thing',
        model: 'Thing',
        populate: {
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
        },
      },
    ])
    .exec();
};

RelaySchema.statics.findByThingAndPopulate = async function (this: IRelayModel, thingId: string) {
  return this.find({ thing: thingId })
    .populate([
      {
        path: 'thing',
        model: 'Thing',
        populate: {
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
        },
      },
    ])
    .exec();
};

const Relay: IRelayModel = model<IRelay, IRelayModel>('Relay', RelaySchema, 'relays');
export default Relay;

interface IRelayModel extends Model<IRelay> {
  findByIdAndPopulate(relayId: string): Promise<IRelayPopulated>;
  findByThingAndPopulate(thingId: string): Promise<IRelayPopulated[]>;
}
