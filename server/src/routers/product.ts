import express from 'express'

import { findAll, findByFilter, findById } from '../controllers/product'

const router = express.Router()

// Every path we define here will get /api/v1/products prefix
router.get('/', findAll)
router.get('/filterBy', findByFilter)
router.get('/:productId', findById)

export default router
