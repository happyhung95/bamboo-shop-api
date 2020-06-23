import { Request, Response, NextFunction } from 'express'

import {
  UnauthorizedError,
  NotFoundError,
  InvalidRequestError,
  InternalServerError,
  ForbiddenError,
} from '../../helpers/apiError'
import User, { UserDocument } from './../../models/User'

//! require params userId in request OR req.user
//! require req.body_token (token payload)
//! supply req.user
export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    // will not fetch user if already exists from previous middleware
    const user = req.user ? (req.user as UserDocument) : await User.findById(req.params.userId).exec()
    if (!user) return next(new NotFoundError('User not found'))

    if (!user.active) return next(new ForbiddenError('User is temporarily banned. Please contact admin'))

    const { _id, role } = req.body._token // from previous middleware
    const authorizedRoles = ['user', 'admin']

    //check authorization
    if (authorizedRoles.includes(role) && _id == user._id) {
      req.user = user
      next()
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new InvalidRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
