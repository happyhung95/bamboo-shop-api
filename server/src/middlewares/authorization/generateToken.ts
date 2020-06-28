import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { InternalServerError, InvalidRequestError } from '../../helpers/apiError'
import { UserDocument } from './../../models/User'
import { JWT_SECRET } from '../../util/secrets'

//! require req.user
//! supply access token in response cookie
export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new InvalidRequestError())

    const { role, _id } = req.user as UserDocument // from previous middleware

    // create signIn token OR reset password token
    // req.body._resetPassword from verifyEmail middleware
    const payload = req.body._resetPassword ? { role, _id, resetPassToken: true } : { role, _id }

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

    // add token to response header
    res.header('Authorization', `Bearer ${accessToken}`)
    next()
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
//TODO: add validation for password change
