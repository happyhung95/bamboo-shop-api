import express from 'express'

import {
  signUp,
  signIn,
  findById,
  updateUser,
  forgotPassword,
  renewPassword,
  resetPassword,
  approveResetPassword,
} from '../controllers/user'
import {
  generateToken,
  verifyPassword,
  verifyGoogleToken,
  checkUserAuthorization,
  verifyToken,
  verifyEmail,
  sendTokenToEmail,
  checkAccountStatus,
} from '../middlewares/authorization/'
import { createUser } from '../middlewares/user/'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.post('/signup', createUser, generateToken, signUp)
router.post('/signin', verifyPassword, checkAccountStatus, generateToken, signIn)
router.post('/signin/google', verifyGoogleToken, generateToken, signIn)
router.get('/:userId', findById)
router.patch('/:userId', verifyToken, checkUserAuthorization, checkAccountStatus, updateUser)
router.put('/changepassword', verifyToken, verifyPassword, checkAccountStatus, checkUserAuthorization, renewPassword)
router.post('/forgotpassword', verifyEmail, generateToken, sendTokenToEmail, forgotPassword)
router.post('/resetpassword', verifyToken, approveResetPassword)
router.post('/resetpassword/verified', verifyToken, resetPassword)

export default router
