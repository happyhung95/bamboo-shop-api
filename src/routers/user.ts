import express from 'express'

import {
  createUser,
  signIn,
  findById,
  updateUser,
  forgotPassword,
  renewPassword,
  resetPassword,
  verifyResetToken,
} from '../controllers/user'
import checkUserAuthorization from '../middlewares/authorization/checkUserAuth'
import verifyPassword from '../middlewares/authorization/verifyPass'
import generateToken from '../middlewares/authorization/generateToken'
import verifyToken from '../middlewares/authorization/verifyToken'
import verifyGoogleToken from '../middlewares/authorization/verifyGoogle'
import verifyEmail from '../middlewares/authorization/verifyEmail'
import sendTokenToEmail from '../middlewares/authorization/sendTokenToEmail'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.post('/signup', createUser)
router.post('/signin', verifyPassword, generateToken, signIn)
router.post('/signin/google', verifyGoogleToken, generateToken, signIn)
router.get('/:userId', findById)
router.patch('/:userId', verifyToken, checkUserAuthorization, updateUser)
router.post('/changepassword', verifyToken, verifyPassword, checkUserAuthorization, renewPassword)
router.post('/forgotpassword', verifyEmail, generateToken, sendTokenToEmail, forgotPassword)
router.post('/resetpassword', verifyToken, verifyResetToken)
router.post('/resetpassword/verified', verifyToken, resetPassword)

export default router
