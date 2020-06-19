import { Request, Response, NextFunction } from 'express'

import User from '../models/User'
import UserService from '../services/user'
import { NotFoundError, InvalidRequestError, InternalServerError, UnauthorizedError } from '../helpers/apiError'
import WHITELIST from '../helpers/adminWhitelist'

//* PUT /admin/user/ban/:username
export const changeAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ban } = req.body
    const username = req.params.username

    const updatedUser = await UserService.changeAccountStatus(username, ban)

    res.status(204).json(updatedUser)
  } catch (error) {
    if (error.name === 'CastError') {
      next(new NotFoundError('User not found', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* POST /users/signup
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, firstName, lastName, email, role, username, password } = req.body

    //! only emails in whitelist can create admin account
    if (role === 'admin' && WHITELIST.includes(email) === false) next(new UnauthorizedError('User not authorized'))

    const user = new User({
      id,
      firstName,
      lastName,
      email,
      role,
      username,
      password,
    })

    await UserService.create(user)

    res.status(201).json(user)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new InvalidRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* POST /users/signin
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body

    const token = await UserService.authenticate(username, password)

    if (!token) {
      next(new NotFoundError('Account not found'))
    }

    res.status(201).json(token)
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}

//* GET /users/:userId
export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await UserService.findById(req.params.userId))
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
    const update = req.body
    const userId = req.params.userId

    const updatedUser = await UserService.update(userId, update)

    res.status(204).json(updatedUser)
  } catch (error) {
    if (error.name === 'CastError') {
      next(new NotFoundError('User not found', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//* POST /users/forgotpassword
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const token = await UserService.authenticate(username, password)
    if (!token) next(new NotFoundError('Account not found'))

    res.status(201).json(token)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new InvalidRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
