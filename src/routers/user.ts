import express from 'express'

import { createUser, findById } from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.post('/signup', createUser)
router.get('/:userId', findById)

export default router
