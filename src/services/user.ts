import bcrypt from 'bcrypt'

import User, { UserDocument } from '../models/User'
import ADMIN_WHITELIST from '../helpers/adminWhitelist'
import ApiError, { UnauthorizedError, NotFoundError } from '../helpers/apiError'

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

function create(reqBody: any): Promise<UserDocument> {
  const { googleId = '', firstName, lastName, email, username } = reqBody
  let { password } = reqBody

  //hash password for /signup route (with password but no googleId)
  password = bcrypt.hashSync(password, 10)

  // if email in the admin whitelist, create admin account
  const role = ADMIN_WHITELIST.includes(email) ? 'admin' : 'user'

  const user = new User({
    googleId,
    firstName,
    lastName,
    email,
    role,
    username,
    password,
  })
  return user.save()
}

function findByEmail(email: string): Promise<UserDocument | null> {
  return User.findOne({ email }).exec() // .exec() will return a true Promise
}

async function findOrCreate(parsedToken: any, googleId: string): Promise<ApiError | UserDocument> {
  const { given_name: firstName, family_name: lastName, email } = parsedToken.payload
  // find user by email, if found return user
  const user = await findByEmail(email)
  if (user) {
    return user
  } else {
    // create newUser if not exist in db
    return create({ firstName, lastName, email, googleId, username: email, password: googleId })
  }
}

function update(userId: string, update: Partial<UserDocument>): Promise<ApiError | UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user): ApiError | UserDocument | PromiseLike<UserDocument> => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
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
  create,
  findByEmail,
  findOrCreate,
  update,
}
