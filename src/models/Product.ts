import mongoose, { Document } from 'mongoose'
import { VarianDocument, variantSchema } from './subSchema/Variant'

export type ProductDocument = Document & {
  id: number;
  name: string;
  createdAt: Date;
  manufacturer: string;
  variants: VarianDocument[]; //* array of variants. One product can have multiple variant
  category: string[]; //* array of category name. One product can belong to multiple categories
}

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    required: true,
  },
  name: {
    type: String,
    index: true,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true,
  },
  variants: [variantSchema],
  category: [String],
})

export default mongoose.model<ProductDocument>('Product', productSchema)
