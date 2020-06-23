import { Request, Response, NextFunction } from 'express'

import { InternalServerError, InvalidRequestError } from '../../helpers/apiError'
import User from '../../models/User'
import logger from '../../util/logger'

//! supply req.user
export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body
    if (!email) return next(new InvalidRequestError())

    const user = await User.findOne({ email }).exec()
    // return success even if no email match found
    if (!user) return res.status(202).json({ message: 'Reset password link sent' })

    // Condition to generate and verify ResetToken
    req.body._resetPassword = true

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'CastError') {
      next(new InvalidRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
