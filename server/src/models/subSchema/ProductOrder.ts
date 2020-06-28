import mongoose, { Document } from 'mongoose'

export type ProductOrderDocument = Document & {
  productId: string;
  variantId: string;
  unitPrice: number;
  discount: number;
  quantity: number;
}

export const productOrderSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  variantId: {
    type: String,
    required: true,
    trim: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
})
