// TODO: order schema
//* created at, user id, product ids (with quantity), total amount, status (paid, unpaid, returned....).

import mongoose, { Document } from 'mongoose'
import { productOrderSchema, ProductOrderDocument } from './subSchema/ProductOrder'

export type OrderDocument = Document & {
  customId: number;
  userId: string;
  products: ProductOrderDocument[];
  deliverTo: string;
  discount: number;
  totalAmount: number;
  status: string;
  isDeleted: boolean;
}

const orderSchema = new mongoose.Schema(
  {
    customId: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      index: true,
      required: true,
      trim: true,
    },
    products: [productOrderSchema],
    deliverTo: {
      type: String,
      required: true,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      enum: ['paid', 'inTransit', 'delivered', 'finished', 'cancelled'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model<OrderDocument>('Product', orderSchema)
