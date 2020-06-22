import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError, NotFoundError, InvalidRequestError, InternalServerError } from '../../helpers/apiError'
import User from '../../models/User'

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.userId).exec()
    if (!user) return next(new NotFoundError('User not found'))

    const { id, role } = req.body._token // from previous middleware
    const authorizedRoles = ['user', 'admin']
    //check authorization
    if (authorizedRoles.includes(role) && id === user!._id) {
      req.body.__user = user
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
