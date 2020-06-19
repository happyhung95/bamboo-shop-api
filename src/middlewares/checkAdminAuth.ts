import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '../helpers/apiError'
import { JWT_SECRET } from './../util/secrets'
import { TokenPayload } from '../types/types'

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    // extract token from request's header
    const { token } = req.headers
    // check if user is admin
    const decoded = jwt.verify(token as string, JWT_SECRET)
    // call next() if role from payload is 'admin'
    if ((decoded as TokenPayload).role === 'admin') {
      next()
    } else {
      next(new UnauthorizedError())
    }
  } catch (error) {
    next(new UnauthorizedError())
  }
}
