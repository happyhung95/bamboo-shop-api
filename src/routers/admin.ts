import express from 'express'

import { createProduct } from '../controllers/product'

const router = express.Router()

// Every path we define here will get /api/v1/admin prefix
router.post('/product', createProduct)

export default router
