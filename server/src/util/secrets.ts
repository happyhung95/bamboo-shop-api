import dotenv from 'dotenv'
import fs from 'fs'

import logger from './logger'

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables')
  dotenv.config({ path: '.env' })
} else {
  logger.debug('Using .env.example file to supply config environment variables')
  dotenv.config({ path: '.env.example' }) // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV
const prod = ENVIRONMENT === 'production' // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env['SESSION_SECRET'] as string
export const JWT_SECRET = process.env['JWT_SECRET'] as string

export const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID'] as string
export const GOOGLE_CLIENT_SECRET = process.env['GOOGLE_CLIENT_SECRET'] as string

export const GOOGLE_TOKEN = process.env['GOOGLE_TOKEN'] as string
export const GOOGLE_TOKEN_EXPIRED = process.env['GOOGLE_TOKEN_EXPIRED'] as string

export const ETHEREAL_USER_SECRET = process.env['ETHEREAL_USER_SECRET'] as string
export const ETHEREAL_PASSWORD_SECRET = process.env['ETHEREAL_PASSWORD_SECRET'] as string

export const MONGODB_URI = (prod ? process.env['MONGODB_URI'] : process.env['MONGODB_URI_LOCAL']) as string

if (!SESSION_SECRET || !JWT_SECRET) {
  logger.error('No client secret. Set SESSION_SECRET or JWT_SECRET environment variable.')
  process.exit(1)
}

if (!MONGODB_URI) {
  if (prod) {
    logger.error('No mongo connection string. Set MONGODB_URI environment variable.')
  } else {
    logger.error('No mongo connection string. Set MONGODB_URI_LOCAL environment variable.')
  }
  process.exit(1)
}
