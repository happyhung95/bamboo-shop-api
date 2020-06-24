import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError, InternalServerError } from '../../helpers/apiError'

//! require req.body._token (token payload)
export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = req.body._token // from previous middleware
    if (role === 'admin') {
      next()
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
