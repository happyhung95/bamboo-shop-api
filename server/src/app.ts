import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import mongoose from 'mongoose'
import passport from 'passport'
import bluebird from 'bluebird'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import rateLimit from 'express-rate-limit'
import redis from 'redis'
import idempotency from 'express-idempotent-redis'

import { MONGODB_URI } from './util/secrets'
import { GoogleStrategy } from './middlewares/authorization/verifyGoogle'
import router from './routers'
import apiErrorHandler from './middlewares/apiErrorHandler'

const app = express()
const mongoUrl = MONGODB_URI

mongoose.Promise = bluebird
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err: Error) => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
    process.exit(1)
  })

// Express configuration
app.set('port', process.env.PORT || 3000)

// Use common 3rd-party middlewares
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

//Use Passport
app.use(passport.initialize())
passport.use(GoogleStrategy)

// Allow all origins - CORS
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*'])
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.append('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// Add CSRF protection
app.use(cookieParser())
app.use(csrf({ cookie: true }))

// Limit request from each user's IP, 10 requests in 10 seconds
const requestLimiter = rateLimit({
  windowMs: 10 * 1000, // 24 hrs in milliseconds
  max: 10,
  message: 'You have exceeded the 10 requests in 10 seconds limit!',
  headers: true,
})
app.use(requestLimiter)

app.use(
  idempotency({
    redisClient: redis.createClient(),
  })
)

// Use router
app.use('/api/v1/', router)

// Custom API error handler
app.use(apiErrorHandler)

export default app
