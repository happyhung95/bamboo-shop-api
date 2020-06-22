import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { InternalServerError } from '../../helpers/apiError'
import { UserDocument } from './../../models/User'
import { JWT_SECRET } from '../../util/secrets'

//! require req.user
//! supply token in response header
export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { role, _id } = req.user as UserDocument // from previous middleware

    //TODO: add { expiresIn: '1h' }
    const token = jwt.sign({ role, _id }, JWT_SECRET)

    // add token to response header
    res.header('Authorization', `Bearer ${token}`)
    next()
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
