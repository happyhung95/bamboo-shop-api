import { Request, Response, NextFunction } from 'express'

import User, { UserDocument } from '../models/User'
import UserService from '../services/user'
import ApiError, {
  NotFoundError,
  InvalidRequestError,
  InternalServerError,
  UnauthorizedError,
} from '../helpers/apiError'

//* PUT /admin/user/ban/:username
export const changeAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ban } = req.body
    if (ban === undefined) return next(new InvalidRequestError())

    const username = req.params.username
    const updatedUser = await UserService.changeAccountStatus(username, ban)

    res.status(200).json(updatedUser)
  } catch (error) {
    if (error.name === 'CastError') {
      next(new NotFoundError('User not found', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* POST /users/signup
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    res.status(201).json((user as UserDocument).removePassword())
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new InvalidRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* POST /users/signin OR /users/signin/google
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json(req.user)
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}

//* GET /users/:userId
export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await User.findById(req.params.userId).exec())
  } catch (error) {
    if (error.name === 'CastError') {
      next(new NotFoundError('User not found', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* PATCH /users/:userId
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //will not fetch user if already exists from previous middleware
    const currentUser = req.user ? req.user : await User.findById(req.params.userId).exec()
    const update = req.body

    const updatedUser = await UserService.update(currentUser as UserDocument, update)

    if (updatedUser instanceof ApiError) {
      next(updatedUser) // UnauthorizedError
    }

    res.status(200).json(updatedUser)
  } catch (error) {
    if (error.name === 'CastError') {
      next(new NotFoundError('User not found', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* POST /users/changepassword
export const renewPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new NotFoundError('User not found'))
    if (!req.body.newPassword) return next(new InvalidRequestError())

    const currentUser = req.user
    const newPassword: string = req.body.newPassword
    await UserService.updatePassword(currentUser as UserDocument, newPassword)

    res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    if (error.name === 'CastError') {
      next(new NotFoundError('User not found', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* POST /users/forgotpassword
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(202).json({ message: 'Reset password link sent' })
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}

//* POST /users/resetpassword/
export const approveResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resetPassToken } = req.body._token
    if (!resetPassToken) return next(new UnauthorizedError())

    const token = req.headers['x-access-token'] || req.headers['authorization']
    res.header('Authorization', token)

    res.status(200).json({ message: 'Reset token is verified, user can reset password' })
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}

//* POST /users/resetpassword/verified
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id, resetPassToken } = req.body._token
    if (!resetPassToken) return next(new UnauthorizedError())

    const { newPassword } = req.body
    if (!newPassword) return next(new InvalidRequestError())

    const currentUser = await User.findById(_id).exec()
    await UserService.updatePassword(currentUser as UserDocument, newPassword)

    res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
