import { Request, Response, NextFunction } from 'express'
import Product from '../models/Product'
import ProductService from '../services/product'
import ApiError, { NotFoundError, InvalidRequestError, InternalServerError } from '../helpers/apiError'
import product from '../services/product'

//* GET /products
export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //* req.query is optional so need to check
    if (Object.keys(req.query).length !== 0) {
      const response = await ProductService.findAllWithPagination(req.query)

      // if response = InvalidRequestError
      if (response instanceof ApiError) return next(response)
      // if no error
      res.status(200).json(response)
    } else {
      // no parameters = return data without pagination
      res.status(200).json(await ProductService.findAll())
    }
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}

//* GET /products/filterBy
export const findByFilter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ProductService.findByFilter(req.query)

    if (data.length === 0) return next(new NotFoundError('Products not found'))

    res.status(200).json()
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}

//* GET /products/:productId
export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await ProductService.findById(req.params.productId))
  } catch (error) {
    if (error.name === 'CastError') {
      next(new NotFoundError('Product not found', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* POST /admin/product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, manufacturer, variants, category } = req.body
    const product = new Product({
      id,
      name,
      manufacturer,
      variants,
      category,
    })

    await ProductService.create(product)
    res.status(201).json(product)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new InvalidRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* PATCH /admin/product/:productId
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update = req.body
    const productId = req.params.productId

    const updatedProduct = await ProductService.update(productId, update)

    res.status(201).json(updatedProduct)
  } catch (error) {
    if (error.name === 'CastError') {
      next(new NotFoundError('Product not found', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* DELETE /admin/product/:productId
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ProductService.deleteProduct(req.params.productId)

    res.status(204).end()
  } catch (error) {
    if (error.name === 'CastError') {
      next(new NotFoundError('Product not found', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
