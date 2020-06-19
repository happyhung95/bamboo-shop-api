import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '../helpers/apiError'
import { JWT_SECRET } from '../util/secrets'
import { TokenPayload } from '../types/types'

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    // extract token from request's header
    const { token } = req.headers
    // check if user is admin
    const decoded = jwt.verify(token as string, JWT_SECRET)

    if ((decoded as TokenPayload).role === 'user') {
      next()
    } else {
      next(new UnauthorizedError('User not authorized'))
    }
  } catch (error) {
    next(new UnauthorizedError('User not authorized'))
  }
}
