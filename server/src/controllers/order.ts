import { Request, Response, NextFunction } from 'express'

import { InternalServerError } from '../helpers/apiError'

//* POST /order/:userId
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('reach the end')
    res.status(201).json({ message: 'ok' })
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
