import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { generateProducts } from '../../helper'

const TOTAL_PRODUCTS = 25

describe('getAll products route', () => {
  beforeAll(async () => {
    jest.setTimeout(1000000000) // override maxTimeOut of jest
    await dbHelper.connect()
    await generateProducts(TOTAL_PRODUCTS)
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return products without pagination', async () => {
    const res = await request(app).get('/api/v1/products').send()
    const { data } = res.body
    expect(res.status).toBe(200)
    expect(data).toHaveLength(TOTAL_PRODUCTS)
  })

  it('should return products with pagination, page 1, ', async () => {
    const res = await request(app).get('/api/v1/products').query({ pageLimit: 10, pageNumber: 1 }).send()
    const { data } = res.body
    expect(res.status).toBe(200)
    expect(data).toHaveLength(10)
    expect(data[0].id).toBe(1) // start index
    expect(data[data.length - 1].id).toBe(10) // end index
  })

  it('should return products with pagination, page 1, and auto correct pageLimit to 10 ', async () => {
    const res = await request(app).get('/api/v1/products').query({ pageLimit: 1, pageNumber: 1 }).send()
    const { data } = res.body
    expect(res.status).toBe(200)
    expect(data).toHaveLength(10)
    expect(data[0].id).toBe(1) // start index
    expect(data[data.length - 1].id).toBe(10) // end index
  })

  it('should return products with pagination, page 2, ', async () => {
    const res = await request(app).get('/api/v1/products').query({ pageLimit: 12, pageNumber: 2 }).send()
    const { data } = res.body
    expect(res.status).toBe(200)
    expect(data).toHaveLength(12)
    expect(data[0].id).toBe(13) // start index
    expect(data[data.length - 1].id).toBe(24) // end index
  })

  it('should return Invalid request, missing pageNumber ', async () => {
    const res = await request(app).get('/api/v1/products').query({ pageLimit: 12 }).send()
    expect(res.status).toBe(400)
  })

  it('should return Invalid request, missing pageLimit ', async () => {
    const res = await request(app).get('/api/v1/products').query({ pageNumber: 2 }).send()
    expect(res.status).toBe(400)
  })

  it('should return Invalid request, pageNumber too high ', async () => {
    const res = await request(app).get('/api/v1/products').query({ pageLimit: 12, pageNumber: 100 }).send()
    expect(res.status).toBe(400)
  })

  it('should return Invalid request, pageLimit and pageNumber out of products list range ', async () => {
    const res = await request(app).get('/api/v1/products').query({ pageLimit: 100, pageNumber: 2 }).send()
    expect(res.status).toBe(400)
  })
})
