import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '../helpers/apiError'
import { JWT_SECRET } from '../util/secrets'
import { TokenPayload } from '../types/types'

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    // extract token from request's header
    const { token } = req.headers
    // verify token
    const decoded = jwt.verify(token as string, JWT_SECRET)

    const authorizedRoles = ['user', 'admin']
    // call next() if role from payload is 'user' or 'admin'
    if (authorizedRoles.includes((decoded as TokenPayload).role)) {
      next()
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(new UnauthorizedError())
  }
}
