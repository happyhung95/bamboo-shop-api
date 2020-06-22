import mongoose, { Document } from 'mongoose'

export type CounterDocument = Document & {
  product: number;
  order: number;
}

//* To count the number of generated IDs
const counterSchema = new mongoose.Schema({
  product: Number,
  order: Number,
})

export default mongoose.model<CounterDocument>('Counter', counterSchema)
