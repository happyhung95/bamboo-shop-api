import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { InternalServerError } from '../../helpers/apiError'
import { UserDocument } from './../../models/User'
import { JWT_SECRET } from '../../util/secrets'

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { role, _id } = req.user as UserDocument // from previous middleware
    //TODO: add { expiresIn: '1h' }
    const token = jwt.sign({ role, _id }, JWT_SECRET)
    req.body._token = `Bearer ${token}`
    next()
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
