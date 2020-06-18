import User, { UserDocument } from '../models/User'

function changeAccountStatus(
  userId: string,
  ban: boolean
): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User with ${userId} not found`)
      }
      if (ban) {
        user.active = false
      } else {
        user.active = true
      }
      return user.save()
    })
}

function create(user: UserDocument): Promise<UserDocument> {
  return user.save()
}

function findById(userId: string): Promise<UserDocument> {
  return User.findById(userId)
    .exec() // .exec() will return a true Promise
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      return user
    })
}

export default {
  changeAccountStatus,
  create,
  findById,
}
