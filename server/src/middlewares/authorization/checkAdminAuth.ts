import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError, InternalServerError } from '../../helpers/apiError'
import User, { UserDocument } from './../../models/User'

//! require req.body._token (token payload)
//! supply req.user
export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { role, _id } = req.body._token // from previous middleware
    if (role === 'admin') {
      const user = await User.findById(_id).exec()
      req.user = user as UserDocument
      next()
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
