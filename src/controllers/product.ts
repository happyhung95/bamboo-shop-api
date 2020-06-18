import { Request, Response, NextFunction } from 'express'
import Product from '../models/Product'
import ProductService from '../services/product'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

//* GET /products
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //* req.query is optional so need to check
    if (Object.keys(req.query).length !== 0) {
      res
        .status(200)
        .json(await ProductService.findAllWithPagination(req.query))
    } else {
      res.status(200).json(await ProductService.findAll())
    }
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//* GET /products/filterBy
export const findByFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(await ProductService.findByFilter(req.query))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//* GET /products/:productId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(await ProductService.findById(req.params.productId))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//* POST /admin/product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* PUT /admin/product/:productId
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const productId = req.params.productId
    const updatedProduct = await ProductService.update(productId, update)
    res.json(updatedProduct)
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//* DELETE /admin/product/:productId
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ProductService.deleteProduct(req.params.productId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}
