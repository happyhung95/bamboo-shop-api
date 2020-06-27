import { Request, Response, NextFunction } from 'express'

import { InternalServerError, ForbiddenError } from '../../helpers/apiError'
import { UserDocument } from './../../models/User'

//! require req.user
export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user
    if ((user as UserDocument).active) {
      next()
    } else {
      next(new ForbiddenError('User is temporarily banned. Please contact admin'))
    }
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
