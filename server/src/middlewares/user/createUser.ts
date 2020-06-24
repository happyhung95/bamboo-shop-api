import { Request, Response, NextFunction } from 'express'

import ApiError, { InvalidRequestError, InternalServerError } from '../../helpers/apiError'
import UserService from '../../services/user'

//! supply req.user
export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserService.create(req.body)
    if (user instanceof ApiError) return next(user) //InvalidRequestError

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new InvalidRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
