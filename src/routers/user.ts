import express from 'express'

import { createUser, findById, signIn, updateUser, resetPassword } from '../controllers/user'
import checkUserAuth from '../middlewares/checkUserAuth'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.post('/signup', createUser)
router.post('/signin', signIn)
router.get('/:userId', findById)
router.patch('/:userId', checkUserAuth, updateUser) //! require User / admin authorization
router.post('/forgotpassword', resetPassword)

export default router
