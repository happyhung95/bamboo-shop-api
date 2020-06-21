import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User, { UserDocument } from '../models/User'
import { JWT_SECRET } from './../util/secrets'
import { Token } from '../types/types'
import ADMIN_WHITELIST from '../helpers/adminWhitelist'
import ApiError, { UnauthorizedError } from '../helpers/apiError'

function changeAccountStatus(userId: string, ban: boolean): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then(user => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      if (ban) {
        user.active = false
      } else {
        user.active = true
      }
      return user.save()
    })
}

async function findOrCreate(reqBody, googleId = ''): Promise<ApiError | UserDocument> {
  const { id, firstName, lastName, email, role, username, password } = reqBody
  // find user by email, if found return user
  const filter = { email: email }
  const user = await User.findOne(filter).exec()
  if (user) return user

  // create newUser if not exist in db
  //! only emails in whitelist can create admin account
  if (role === 'admin' && ADMIN_WHITELIST.includes(email) === false) return new UnauthorizedError('User not authorized')
  const newUser = new User({
    id,
    googleId,
    firstName,
    lastName,
    email,
    role,
    username,
    password,
  })
  //hash password
  newUser.password = bcrypt.hashSync(newUser.password, 10)
  newUser.save()

  return
}

function findById(userId: string): Promise<UserDocument> {
  return User.findById(userId)
    .exec() // .exec() will return a true Promise
    .then(user => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      return user
    })
}

//*sign in
function authenticate(username: string, password: string): Promise<Token | null> {
  return User.findOne({ username: username })
    .select('password role')
    .exec() // .exec() will return a true Promise
    .then(async user => {
      if (!user) {
        throw new Error(`User ${username} not found`)
      }
      // validate password
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        // create JWT token and send it to client
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET) //TODO: add { expiresIn: '1h' }
        return { token: token }
      } else {
        return null
      }
    })
}

function update(userId: string, update: Partial<UserDocument>): Promise<ApiError | UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user): ApiError | UserDocument | PromiseLike<UserDocument> => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      if (update.id) {
        user.id = update.id
      }
      if (update.firstName) {
        user.firstName = update.firstName
      }
      if (update.lastName) {
        user.lastName = update.lastName
      }
      if (update.username) {
        user.username = update.username
      }
      if (update.role) {
        if (update.role === 'admin') {
          // email must be in whitelist
          if (ADMIN_WHITELIST.includes(user.email)) {
            user.role = update.role
          } else return new UnauthorizedError()
        }
        user.role = update.role
      }
      return user.save()
    })
}

export default {
  changeAccountStatus,
  findOrCreate,
  findById,
  authenticate,
  update,
}
