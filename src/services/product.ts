import Product, { ProductDocument } from '../models/Product'
import ApiError, { InvalidRequestError } from '../helpers/apiError'

type WithPagination<T> = {
  pageNumber: number;
  pageLimit: number;
  totalProducts: number;
  data: T[];
}

function findAll(): Promise<ProductDocument[]> {
  return Product.find().sort({ name: 1 }).exec() // Return a Promise, without pagination
}

async function findAllWithPagination(query: any): Promise<ApiError | WithPagination<ProductDocument>> {
  let { pageLimit, pageNumber } = query

  if (!pageLimit || !pageNumber) {
    return new InvalidRequestError('Invalid request - Require both pageLimit and pageNumber parameters for pagination')
  }

  pageNumber = Number(query.pageNumber) // minimum 1
  pageLimit = Number(query.pageLimit) > 10 ? Number(query.pageLimit) : 10 // minimum 10

  const totalProducts = await Product.estimatedDocumentCount().exec()
  const totalPages = totalProducts / pageLimit

  // validate pageNumber
  if (pageNumber < 1 || pageNumber > totalPages) {
    return new InvalidRequestError('Invalid pageNumber')
  }

  const skippedProducts = pageLimit * (pageNumber - 1) // no need to skip on page 1

  const data = await Product.find().skip(skippedProducts).limit(pageLimit).exec()

  return { pageLimit, pageNumber, totalProducts, data }
}

function findByFilter(query): Promise<ProductDocument[]> {
  const { name, category, availability, manufacturer, color } = query
  const filter: any = {}

  if (name) {
    filter.name = { $regex: `${name}`, $options: 'i' }
  }
  if (category) {
    filter.category = { $in: category }
  }
  if (availability) {
    filter['variants.inStock'] = { $gt: 0 }
  }
  if (manufacturer) {
    filter.manufacturer = { $regex: `${manufacturer}`, $options: 'i' }
  }
  if (color) {
    filter['variants.color'] = { $regex: `${color}`, $options: 'i' }
  }

  return Product.find(filter).sort({ name: 1 }).exec()
}

function findById(productId: string): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec() // .exec() will return a true Promise
    .then(product => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }
      return product
    })
}

function create(product: ProductDocument): Promise<ProductDocument> {
  return product.save()
}

function update(productId: string, update: Partial<ProductDocument>): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec()
    .then(product => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }
      if (update.id) {
        product.id = update.id
      }
      if (update.name) {
        product.name = update.name
      }
      if (update.manufacturer) {
        product.manufacturer = update.manufacturer
      }
      if (update.variants) {
        update.variants.forEach(updatedVar => {
          //* update the variant if it matches the color AND size
          const match = product.variants.some(currentVar => {
            if (updatedVar.color === currentVar.color && updatedVar.size === currentVar.size) {
              currentVar.inStock = updatedVar.inStock
              currentVar.price = updatedVar.price
              return true // match found => break the .some() loop
            } else return false // continue looping
          })
          //* add to the variants if no matches found
          if (!match) {
            product.variants.push(updatedVar)
          }
        })
      }
      if (update.category) {
        product.category = update.category
      }

      return product.save()
    })
}

function deleteProduct(productId: string): Promise<ProductDocument | null> {
  return Product.findByIdAndDelete(productId).exec()
}

export default {
  findAll,
  findAllWithPagination,
  findByFilter,
  findById,
  create,
  update,
  deleteProduct,
}
