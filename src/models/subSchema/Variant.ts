import mongoose, { Document } from 'mongoose'

export type VarianDocument = Document & {
  updatedAt: Date;
  inStock: number;
  price: number;
  size: string;
  color: string;
}

export const variantSchema = new mongoose.Schema({
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  inStock: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    type: String,
    required: true,
    enum: ['S', 'M', 'L'],
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  // TODO: add photo links
})
