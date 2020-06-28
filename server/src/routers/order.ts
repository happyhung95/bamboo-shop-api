import express from 'express'

import { createOrder } from '../controllers/order'
import { checkUserAuthorization, verifyToken, checkAccountStatus } from '../middlewares/authorization'
import { checkIdempotency } from '../middlewares/security'

const router = express.Router()

// Every path we define here will get /api/v1/order prefix
router.post('/:userId', checkIdempotency, verifyToken, checkUserAuthorization, checkAccountStatus, createOrder)

export default router
