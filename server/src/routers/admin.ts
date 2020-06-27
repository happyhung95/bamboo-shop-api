import express from 'express'

import { createProduct, updateProduct, deleteProduct } from '../controllers/product'
import { changeAccountStatus } from '../controllers/user'
import { checkAdminAuthorization, verifyToken, checkAccountStatus } from '../middlewares/authorization/'

const router = express.Router()

// Every path we define here will get /api/v1/admin prefix
//! all routes require admin authorization
router.post('/product', verifyToken, checkAdminAuthorization, checkAccountStatus, createProduct)
router.patch('/product/:productId', verifyToken, checkAdminAuthorization, checkAccountStatus, updateProduct)
router.delete('/product/:productId', verifyToken, checkAdminAuthorization, checkAccountStatus, deleteProduct)
router.put('/user/ban/:username', verifyToken, checkAdminAuthorization, checkAccountStatus, changeAccountStatus)

export default router
