import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { admin, getAdminToken, getUserToken } from '../../helper'

const product = {
  id: 100,
  name: 'Light bamboo bag',
  manufacturer: 'string',
  variants: [
    {
      inStock: 100,
      price: 19.9,
      size: 'S',
      color: 'light',
    },
  ],
  category: ['bag'],
}

const newSizeM = {
  variants: [
    {
      inStock: 100,
      price: 29.9,
      size: 'M',
      color: 'light',
    },
  ],
}

const productSizeS_M = { ...product, variants: [...product.variants, ...newSizeM.variants] }

const newSizeS = {
  variants: [
    {
      inStock: 100,
      price: 29.9,
      size: 'S',
      color: 'light',
    },
  ],
}

const updatedProductSizeS = { ...product, ...newSizeS }

const newColor = {
  variants: [
    {
      inStock: 100,
      price: 20.9,
      size: 'S',
      color: 'dark',
    },
  ],
}

const productNewColor = { ...product, variants: [...product.variants, ...newColor.variants] }

let adminToken: string
let userToken: string
let productId: string
const falseId = '5a4sd545sad'

describe('updateProduct admin route', () => {
  beforeEach(async () => {
    await dbHelper.connect()
    adminToken = await getAdminToken()
    userToken = await getUserToken()
    const productRes = await request(app).post('/api/v1/admin/product').set('authorization', adminToken).send(product)
    productId = productRes.body._id
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return updated product - size S and M', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/product/${productId}`)
      .set('authorization', adminToken)
      .send(newSizeM)
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(productSizeS_M)
  })

  it('should return updated product - size S updated', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/product/${productId}`)
      .set('authorization', adminToken)
      .send(newSizeS)
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(updatedProductSizeS)
  })

  it('should return updated product - new color size S', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/product/${productId}`)
      .set('authorization', adminToken)
      .send(newColor)
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(productNewColor)
  })

  it('should return Unauthorized Request - missing token', async () => {
    const res = await request(app).patch(`/api/v1/admin/product/${productId}`).send(newSizeM)
    expect(res.status).toBe(401)
  })

  it('should return Unauthorized Request - user token', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/product/${productId}`)
      .set('authorization', userToken)
      .send(newSizeM)
    expect(res.status).toBe(401)
  })

  it('should return Product not found - false product Id', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/product/${falseId}`)
      .set('authorization', adminToken)
      .send(newSizeM)
    expect(res.status).toBe(404)
  })

  it('should return Cannot find route - missing product Id', async () => {
    const res = await request(app).patch(`/api/v1/admin/product/`).set('authorization', adminToken).send(newSizeM)
    expect(res.status).toBe(404)
  })

  it('should return Forbidden - admin is banned by another admin', async () => {
    //ban user
    await request(app)
      .put(`/api/v1/admin/user/ban/${admin.username}`)
      .set('authorization', adminToken)
      .send({ ban: true })

    const res = await request(app)
      .patch(`/api/v1/admin/product/${productId}`)
      .set('authorization', adminToken)
      .send(newSizeM)
    expect(res.status).toBe(403)
    expect(res.get('authorization')).toBeUndefined()
  })
})
