import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { generateProducts } from '../../helper'
import { ProductDocument } from './../../../src/models/Product'

const TOTAL_PRODUCTS = 35

describe('getByFilter products route', () => {
  beforeAll(async () => {
    jest.setTimeout(1000000) // override maxTimeOut of jest
    await dbHelper.connect()
    await generateProducts(TOTAL_PRODUCTS)
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return products with name: hat ', async () => {
    const res = await request(app).get('/api/v1/products/filterBy').query({ name: 'hat' }).send()
    const { data } = res.body
    expect(res.status).toBe(200)
    data.map((product: ProductDocument) => expect(product.name).toMatch(/hat/))
  })

  it('should return products with name: hat, manufacturer: Thailand, color: yellow ', async () => {
    const res = await request(app)
      .get('/api/v1/products/filterBy')
      .query({ name: 'hat', manufacturer: 'Thailand', color: 'yellow' })
      .send()
    const { data } = res.body
    expect(res.status).toBe(200)
    data.map((product: ProductDocument) => {
      expect(product.name).toMatch(/hat/)
      expect(product.manufacturer).toMatch(/Thailand/)
    })
  })

  it('should return products with name: hat, manufacturer: Thailand, size: M that are still available', async () => {
    const res = await request(app)
      .get('/api/v1/products/filterBy')
      .query({ name: 'hat', manufacturer: 'Thailand', size: 'M', availability: true })
      .send()
    const { data } = res.body
    expect(res.status).toBe(200)
    data.map((product: ProductDocument) => {
      expect(product.name).toMatch(/hat/)
      expect(product.manufacturer).toMatch(/Thailand/)
      product.variants.map(variant => {
        expect(variant.inStock).toBeGreaterThan(0)
        expect(variant.size).toBe('M')
      })
    })
  })

  it('should return Products not found, filter - name: gun', async () => {
    const res = await request(app)
      .get('/api/v1/products/filterBy')
      .query({ name: 'gun' })
      .send()
    expect(res.status).toBe(404)
  })
})
