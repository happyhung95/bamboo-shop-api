import bcrypt from 'bcrypt'

import User, { UserDocument } from '../models/User'
import ADMIN_WHITELIST from '../helpers/adminWhitelist'
import ApiError, { UnauthorizedError, InvalidRequestError, NotFoundError } from '../helpers/apiError'
import generateRandomPassword from '../util/generatePassword'

async function changeAccountStatus(username: string, ban: boolean): Promise<UserDocument | ApiError> {
  const user = await User.findOne({ username }).exec()
  if (!user) return new NotFoundError(`User not found`)
  if (ban) {
    user.active = false
  } else {
    user.active = true
  }
  return user.save()
}

function create(reqBody: any): Promise<UserDocument> | ApiError {
  try {
    const { googleId = '', firstName, lastName, email, username } = reqBody
    let { password } = reqBody

    //hash password
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
  } catch (error) {
    return new InvalidRequestError()
  }
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
    const password = generateRandomPassword(googleId)
    // create newUser if not exist in db
    return create({ firstName, lastName, email, googleId, username: email, password })
  }
}

function update(user: UserDocument, update: Partial<UserDocument>): ApiError | Promise<UserDocument> {
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
}

function updatePassword(user: UserDocument, newPassword: string): ApiError | Promise<UserDocument> {
  //hash password
  const hash = bcrypt.hashSync(newPassword, 10)
  user.password = hash
  return user.save()
}

export default {
  changeAccountStatus,
  create,
  findByEmail,
  findOrCreate,
  update,
  updatePassword,
}
