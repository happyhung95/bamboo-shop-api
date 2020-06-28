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
const invalidProduct = {
  id: 100,
  // missing name
  // missing manufacturer
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

let adminToken: string
let userToken: string

describe('createProduct admin route', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    adminToken = await getAdminToken()
    userToken = await getUserToken()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return product', async () => {
    const res = await request(app).post('/api/v1/admin/product').set('authorization', adminToken).send(product)
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(product)
  })

  it('should return Unauthorized Request - missing token', async () => {
    const res = await request(app).post('/api/v1/admin/product').send(product)
    expect(res.status).toBe(401)
  })

  it('should return Unauthorized Request - user not admin', async () => {
    const res = await request(app).post('/api/v1/admin/product').set('authorization', userToken).send(product)
    expect(res.status).toBe(401)
  })

  it('should return Invalid Request - Invalid product: missing name and manufacturer', async () => {
    const res = await request(app).post('/api/v1/admin/product').set('authorization', adminToken).send(invalidProduct)
    expect(res.status).toBe(400)
  })

  it('should return Forbidden - admin is banned by another admin', async () => {
    //ban user
    await request(app)
      .put(`/api/v1/admin/user/ban/${admin.username}`)
      .set('authorization', adminToken)
      .send({ ban: true })

    const res = await request(app).post('/api/v1/admin/product').set('authorization', adminToken).send(product)
    expect(res.status).toBe(403)
    expect(res.get('authorization')).toBeUndefined()
  })
})
