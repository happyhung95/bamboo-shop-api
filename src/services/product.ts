import Product, { ProductDocument } from '../models/Product'

type WithPagination<T> = {
  pageNumber: number;
  pageLimit: number;
  totalProducts: number;
  data: T[];
}

function findAll(): Promise<ProductDocument[]> {
  return Product.find().sort({ name: 1 }).exec() // Return a Promise, without pagination
}

async function findAllWithPagination(
  query: any
): Promise<WithPagination<ProductDocument>> {
  let { pageLimit, pageNumber } = query
  if (!pageLimit && !pageNumber) {
    throw new Error('require 2 parameters pageLimit and pageNumber')
  }

  pageNumber = Number(query.pageNumber) - 1
  pageLimit = Number(query.pageLimit) > 10 ? Number(query.pageLimit) : 10 // minimum 10

  const totalProducts = await Product.estimatedDocumentCount().exec()
  const totalPages = totalProducts / pageLimit - 1 // since pageNumber has - 1

  if (pageNumber < 0 || pageNumber > totalPages) {
    throw new Error('invalid pageNumber')
  }
  const data = await Product.find()
    .skip(pageNumber * pageLimit)
    .limit(pageLimit)
    .exec()

  return { pageLimit, pageNumber, totalProducts, data }
}

function findByFilter(query): Promise<ProductDocument[]> {
  const { name, category, availability, manufacturer, color } = query
  const filter: any = {}

  if (name) filter.name = { $regex: `${name}`, $options: 'i' }
  if (category) filter.category = { $in: category }
  if (availability) filter['variants.inStock'] = { $gt: 0 }
  if (manufacturer)
    filter.manufacturer = { $regex: `${manufacturer}`, $options: 'i' }
  if (color) filter['variants.color'] = { $regex: `${color}`, $options: 'i' }
  return Product.find(filter).sort({ name: 1 }).exec()
}

function findById(productId: string): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec() // .exec() will return a true Promise
    .then((product) => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }
      return product
    })
}

function create(product: ProductDocument): Promise<ProductDocument> {
  return product.save()
}

export default {
  findAll,
  findAllWithPagination,
  findByFilter,
  findById,
  create,
}
