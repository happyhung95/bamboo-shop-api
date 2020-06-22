import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError } from '../../helpers/apiError'

export default function (req: Request, res: Response, next: NextFunction) {
  const { role } = req.body._token // from previous middleware
  if (role === 'admin') {
    next()
  } else {
    next(new UnauthorizedError())
  }
}
