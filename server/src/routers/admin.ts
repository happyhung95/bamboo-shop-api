import express from 'express'

import { createProduct, updateProduct, deleteProduct } from '../controllers/product'
import { changeAccountStatus } from '../controllers/user'

const router = express.Router()

//TODO: implement idempotency key
// Every path we define here will get /api/v1/admin prefix
//! all routes require admin authorization, already verified by middlewares in routers/index.ts
router.post('/product', createProduct)
router.patch('/product/:productId', updateProduct)
router.delete('/product/:productId', deleteProduct)
router.put('/user/ban/:username', changeAccountStatus)

export default router
