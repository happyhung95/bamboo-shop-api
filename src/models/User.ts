import mongoose, { Document } from 'mongoose'

export type CategoryDocument = Document & {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  wishList: mongoose.Types.ObjectId[]; //* array of product IDs
  orderId: mongoose.Types.ObjectId[]; //* array of order IDs
}

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
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
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
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
  role: {
    type: String,
    required: true,
    trim: true,
    enum: ['admin', 'user'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  wishList: [mongoose.Types.ObjectId],
  orderId: [mongoose.Types.ObjectId],
})

export default mongoose.model<CategoryDocument>('User', userSchema)
