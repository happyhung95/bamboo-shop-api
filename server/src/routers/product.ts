import express from 'express'

import { findAll, findByFilter, findById } from '../controllers/product'
import { createCSRFToken } from '../middlewares/security'

const router = express.Router()

// Every path we define here will get /api/v1/products prefix
router.get('/', createCSRFToken, findAll) //! landing page, create CSRF token
router.get('/filterBy', findByFilter)
router.get('/:productId', findById)

export default router
