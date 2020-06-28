import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import ADMIN_WHITELIST from '../../../src/helpers/adminWhitelist'

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
    await request(app).post('/api/v1/users/signup').send(admin)
    await request(app).post('/api/v1/users/signup').send(user)
    const res = await request(app).post('/api/v1/users/signin').send(adminCred)
    const res2 = await request(app).post('/api/v1/users/signin').send(userCred)
    adminToken = res.get('authorization')
    userToken = res2.get('authorization')
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
  it('should return Unauthorized Request - user token', async () => {
    const res = await request(app).post('/api/v1/admin/product').set('authorization', userToken).send(product)
    expect(res.status).toBe(401)
  })
  it('should return Invalid Request - missing name and manufacturer', async () => {
    const res = await request(app).post('/api/v1/admin/product').set('authorization', adminToken).send(invalidProduct)
    expect(res.status).toBe(400)
  })
  //TODO: add one test case - admin account is banned
})
