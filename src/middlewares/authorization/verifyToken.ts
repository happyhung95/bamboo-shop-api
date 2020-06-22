import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { InternalServerError, UnauthorizedError } from '../../helpers/apiError'
import { JWT_SECRET } from '../../util/secrets'

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization']
    if (!token) next(new UnauthorizedError())

    token = token as string

    // Remove 'Bearer ' from string
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft()
    }

    const tokenPayload = jwt.verify(token, JWT_SECRET)
    //verification succeeds
    req.body._token = tokenPayload
    next()
  } catch (error) {
    console.log('error in verifyToken', error)
    next(new InternalServerError('Internal Server Error', error))
  }
}
