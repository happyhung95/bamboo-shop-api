import mongoose, { Document } from 'mongoose'

export type VariantDocument = Document & {
  inStock: number;
  price: number;
  discount: number;
  size: string;
  color: string;
  photoUrl: string;
}

export const variantSchema = new mongoose.Schema(
  {
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
    discount: {
      type: Number,
      default: 0,
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
    photoUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
)
