import express from 'express'
import { Request, Response, NextFunction } from 'express'

import passport from 'passport'

import { createUser, findById, updateUser, resetPassword, signInResponse } from '../controllers/user'
import checkUserAuthorization from '../middlewares/authorization/checkUserAuth'
import verifyPassword from '../middlewares/authorization/verifyPass'
import generateToken from '../middlewares/authorization/generateToken'
import verifyToken from '../middlewares/authorization/verifyToken'
import verifyGoogleToken from '../middlewares/authorization/verifyGoogle'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.post('/signup', createUser)
router.post('/signin', verifyPassword, generateToken, signInResponse)
router.post('/signin/google', verifyGoogleToken, generateToken, signInResponse)
router.get('/:userId', findById)
router.patch('/:userId', verifyToken, checkUserAuthorization, updateUser)
router.post('/forgotpassword', resetPassword)

export default router
