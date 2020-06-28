import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { admin, getUserToken, getAdminToken, createProduct } from '../../helper'
import Product from '../../../src/models/Product'

let adminToken: string
let userToken: string
let productId: string
const falseId = '5a4sd545sad'

describe('deleteProduct admin route', () => {
  beforeEach(async () => {
    await dbHelper.connect()
    userToken = await getUserToken()
    adminToken = await getAdminToken()
    const productRes = await createProduct()
    productId = productRes.body._id
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
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

  it('should return Unauthorized Request - user not admin', async () => {
    const res = await request(app).delete(`/api/v1/admin/product/${productId}`).set('authorization', userToken).send()
    expect(res.status).toBe(401)
  })

  it('should return Product not found - false / not exist product Id', async () => {
    const res = await request(app).delete(`/api/v1/admin/product/${falseId}`).set('authorization', adminToken).send()
    expect(res.status).toBe(404)
  })

  it('should return Cannot find route - missing product Id parameter', async () => {
    const res = await request(app).delete(`/api/v1/admin/product/`).set('authorization', adminToken).send()
    expect(res.status).toBe(404)
  })

  it('should return Forbidden - admin is banned by another admin', async () => {
    //ban user
    await request(app)
      .put(`/api/v1/admin/user/ban/${admin.username}`)
      .set('authorization', adminToken)
      .send({ ban: true })

    const res = await request(app).delete(`/api/v1/admin/product/${productId}`).set('authorization', adminToken).send()
    expect(res.status).toBe(403)
    expect(res.get('authorization')).toBeUndefined()
  })
})
