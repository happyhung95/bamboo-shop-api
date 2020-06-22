import express from 'express'

import { createProduct, updateProduct, deleteProduct } from '../controllers/product'
import { changeAccountStatus } from '../controllers/user'
import checkAdminAuthorization from '../middlewares/authorization/checkAdminAuth'
import verifyToken from '../middlewares/authorization/verifyToken'

const router = express.Router()

// Every path we define here will get /api/v1/admin prefix
//! all routes require admin authorization
router.post('/product', verifyToken, checkAdminAuthorization, createProduct)
router.patch('/product/:productId', verifyToken, checkAdminAuthorization, updateProduct)
router.delete('/product/:productId', verifyToken, checkAdminAuthorization, deleteProduct)
router.put('/user/ban/:username', verifyToken, checkAdminAuthorization, changeAccountStatus)

export default router
