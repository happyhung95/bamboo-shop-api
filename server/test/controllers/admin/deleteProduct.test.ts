import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import ADMIN_WHITELIST from '../../../src/helpers/adminWhitelist'
import Product from '../../../src/models/Product'

const admin = {
  firstName: 'test',
  lastName: 'admin',
  email: ADMIN_WHITELIST[0],
  username: 'testAdmin',
  password: 'testPassword',
}

const user = {
  firstName: 'test',
  lastName: 'suite',
  email: 'test@test.com',
  username: 'testUsername',
  password: 'testPassword',
}

const adminCred = {
  username: 'testAdmin',
  password: 'testPassword',
}
const userCred = {
  username: 'testUsername',
  password: 'testPassword',
}

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

let adminToken: string
let userToken: string
let productId: string
const falseId = '5a4sd545sad'

describe('deleteProduct admin route', () => {
  beforeAll(async () => {
    await dbHelper.connect()

    await request(app).post('/api/v1/users/signup').send(admin)
    await request(app).post('/api/v1/users/signup').send(user)
    const res = await request(app).post('/api/v1/users/signin').send(adminCred)
    const res2 = await request(app).post('/api/v1/users/signin').send(userCred)
    adminToken = res.get('authorization')
    userToken = res2.get('authorization')
    const productRes = await request(app).post('/api/v1/admin/product').set('authorization', adminToken).send(product)
    productId = productRes.body._id
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return empty response code 204', async () => {
    const res = await request(app).delete(`/api/v1/admin/product/${productId}`).set('authorization', adminToken).send()
    const deletedProduct = await Product.findById(productId)
    expect(res.status).toBe(204)
    expect(res.body).toStrictEqual({})
    expect(deletedProduct).toBeNull()
  })

  it('should return Unauthorized Request - missing token', async () => {
    const res = await request(app).delete(`/api/v1/admin/product/${productId}`).send()
    expect(res.status).toBe(401)
  })

  it('should return Unauthorized Request - user token', async () => {
    const res = await request(app).delete(`/api/v1/admin/product/${productId}`).set('authorization', userToken).send()
    expect(res.status).toBe(401)
  })

  it('should return Product not found - false product Id', async () => {
    const res = await request(app).delete(`/api/v1/admin/product/${falseId}`).set('authorization', adminToken).send()
    expect(res.status).toBe(404)
  })

  it('should return Cannot find route - missing product Id', async () => {
    const res = await request(app).delete(`/api/v1/admin/product/`).set('authorization', adminToken).send()
    expect(res.status).toBe(404)
  })

  //TODO: add one test case - admin account is banned
})
