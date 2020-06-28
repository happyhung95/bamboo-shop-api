import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  googleId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: string;
  active: boolean;
  wishList: mongoose.Types.ObjectId[]; //* array of product IDs
  orders: mongoose.Types.ObjectId[]; //* array of order IDs
  removePassword: Function;
}

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ['admin', 'user'],
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, //! password won't be sent to Client
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishList: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
  },
  { timestamps: true }
)

userSchema.methods.removePassword = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model<UserDocument>('User', userSchema)
