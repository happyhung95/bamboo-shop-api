import passport from 'passport'
import GoogleTokenStrategy from 'passport-google-id-token'

import { GOOGLE_CLIENT_ID } from '../../util/secrets'
import UserService from '../../services/user'

export const GoogleStrategy = new GoogleTokenStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
  },
  async function (parsedToken: any, googleId: string, done: any) {
    try {
      const user = await UserService.findOrCreate(parsedToken, googleId)
      done(null, user)
    } catch (e) {
      done(null, false)
    }
  }
)

// use the above strategy
export default passport.authenticate('google-id-token', { session: false })
