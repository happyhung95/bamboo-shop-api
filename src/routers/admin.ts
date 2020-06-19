import express from 'express'

import { createProduct, updateProduct, deleteProduct } from '../controllers/product'
import { changeAccountStatus } from '../controllers/user'
import checkAdminAuth from '../middlewares/checkAdminAuth'

const router = express.Router()

// Every path we define here will get /api/v1/admin prefix
//! all routes require admin authorization
router.post('/product', checkAdminAuth, createProduct)
router.put('/product/:productId', checkAdminAuth, updateProduct)
router.delete('/product/:productId', checkAdminAuth, deleteProduct)
router.put('/user/ban/:username', checkAdminAuth, changeAccountStatus)

export default router
