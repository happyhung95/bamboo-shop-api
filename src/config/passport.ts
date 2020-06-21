import passport from 'passport'
import passportLocal from 'passport-local'
import passportFacebook from 'passport-facebook'
import GoogleTokenStrategy from 'passport-google-id-token'

import { GOOGLE_CLIENT_ID } from './../util/secrets'
import UserService from '../services/user'

const LocalStrategy = passportLocal.Strategy
const FacebookStrategy = passportFacebook.Strategy

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
    },
    function (parsedToken, googleId, done) {
      UserService.findOrCreate()
    }
  )
)
