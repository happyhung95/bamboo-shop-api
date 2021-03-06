import mongoose, { Document } from 'mongoose'
import { VariantDocument, variantSchema } from './subSchema/Variant'

export type ProductDocument = Document & {
  id: number;
  name: string;
  manufacturer: string;
  variants: VariantDocument[]; //* array of variants. One product can have multiple variant
  category: string[]; //* array of category name. One product can belong to multiple categories
}

const productSchema = new mongoose.Schema(
  {
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
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    variants: [variantSchema],
    category: [String],
  },
  { timestamps: true }
)

export default mongoose.model<ProductDocument>('Product', productSchema)
