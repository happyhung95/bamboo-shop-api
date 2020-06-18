import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import UserService from '../services/user'
import { NotFoundError, BadRequestError, InternalServerError } from '../helpers/apiError'

//* PUT /admin/user/ban/:username
export const changeAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ban } = req.body
    const username = req.params.username
    const updatedUser = await UserService.changeAccountStatus(username, ban)
    res.json(updatedUser)
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

//* POST /users/signup
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, firstName, lastName, email, role, username, password } = req.body

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
      next(new BadRequestError('Invalid Request', error))
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
    if (!token) next(new NotFoundError('Account not found'))
    res.status(201).json(token)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

//* GET /users/:userId
export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await UserService.findById(req.params.userId))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}
