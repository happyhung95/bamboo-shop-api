import { Request, Response, NextFunction } from 'express'
import Product from '../models/Product'
import ProductService from '../services/product'
import UserService from '../services/user'
import { NotFoundError, BadRequestError, InternalServerError, UnauthorizedError } from '../helpers/apiError'
import { ADMIN } from '../types/types'

//* GET /products
export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //* req.query is optional so need to check
    if (Object.keys(req.query).length !== 0) {
      res.status(200).json(await ProductService.findAllWithPagination(req.query))
    } else {
      res.status(200).json(await ProductService.findAll())
    }
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//* GET /products/filterBy
export const findByFilter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await ProductService.findByFilter(req.query))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//* GET /products/:productId
export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await ProductService.findById(req.params.productId))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//* POST /admin/product
//! require admin authorization
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
    // extract token from request's header
    const { token } = req.headers
    // check if user is admin
    const isAuthorized = UserService.verifyAuthorization(token as string, ADMIN)
    if (!isAuthorized) throw new UnauthorizedError('User not authorized')

    await ProductService.create(product)
    res.status(201).json(product)
  } catch (error) {
    if (error.name === 'Error') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* PUT /admin/product/:productId
//! require admin authorization
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
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
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ProductService.deleteProduct(req.params.productId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}
