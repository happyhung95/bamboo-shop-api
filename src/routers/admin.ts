import express from 'express'

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product'

import { changeAccountStatus } from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/admin prefix
router.post('/product', createProduct)
router.put('/product/:productId', updateProduct)
router.delete('/product/:productId', deleteProduct)
router.put('/user/ban/:username', changeAccountStatus)

export default router
