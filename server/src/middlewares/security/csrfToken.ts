import { Request, Response, NextFunction } from 'express'

//! require req.csrfToken from csurf
//! supply CSRF token in response cookie
export default async function (req: Request, res: Response, next: NextFunction) {
  // Add CSRF token to cookie, will be attached automatically to header by axios
  res.cookie('XSRF-TOKEN', req.csrfToken())
  next()
}
