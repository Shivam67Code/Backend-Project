import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema(
  {
    id: {
      type: String,
      required: true
    },
    subscriber: {
      type: Schema.Types.ObjectId, // person who subscribes
      ref: User,
      required: true
    },
    channel: {
      type: Schema.Types.ObjectId, // one who subscriber subscribes
      ref: User
    },
  },
  { timestamps: true }
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema)