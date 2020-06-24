import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '../../helpers/apiError'
import { JWT_SECRET } from '../../util/secrets'

//! require token in request header
//! supply req.body._token (token payload)
export default function (req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization']
    if (!token) next(new UnauthorizedError())
    token = token as string
    // Remove 'Bearer ' from token
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft()
    }
    // verify token
    const tokenPayload = jwt.verify(token, JWT_SECRET)
    //verification succeeds
    req.body._token = tokenPayload
    next()
  } catch (error) {
    next(new UnauthorizedError('Unauthorized Request', error))
  }
}
