import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import { NotFoundError, InternalServerError, InvalidRequestError } from '../../helpers/apiError'
import User from '../../models/User'

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body

    let user = await User.findOne({ username }).select('password').exec()

    if (!user) return next(new NotFoundError('User not found'))

    // verify password
    const match = await bcrypt.compare(password, user!.password)

    // verify failed
    if (!match) {
      return next(new NotFoundError('User not found'))
    }
    // verify succeeded

    user = await User.findById(user!._id).exec()
    req.user = user!
    next()
  } catch (error) {
    if (error.name === 'CastError') {
      next(new InvalidRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
