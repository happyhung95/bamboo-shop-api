import express from 'express'

import productRouter from './product'
import adminRouter from './admin'
import userRouter from './user'
import orderRouter from './order'

import { checkAdminAuthorization, verifyToken, checkAccountStatus } from '../middlewares/authorization/'

const router = express.Router()

// Every path we define here will get /api/v1 prefix
router.use('/products', productRouter) //! CSRF token is created from products/ route (landing page)
router.use('/admin', verifyToken, checkAdminAuthorization, checkAccountStatus, adminRouter)
router.use('/users', userRouter)
router.use('/order', orderRouter)

export default router
