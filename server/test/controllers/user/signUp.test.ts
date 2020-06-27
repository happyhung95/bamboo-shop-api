import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import ADMIN_WHITELIST from '../../../src/helpers/adminWhitelist'


const user = {
  firstName: 'test',
  lastName: 'suite',
  email: 'test@test.com',
  username: 'testUsername',
  password: 'testPassword',
}

const admin = {
  firstName: 'test',
  lastName: 'suite',
  email: ADMIN_WHITELIST[0],
  username: 'testUsername',
  password: 'testPassword',
}

const invalidUser = {
  firstName: 'test',
  lastName: 'suite',
  username: 'testUsername',
  password: 'testPassword',
}

describe('user signUp route', () => {
  beforeAll(async () => {
    await dbHelper.connect()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a user', async () => {
    const res = await request(app).post('/api/v1/users/signup').send(user)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('createdAt')
    expect(res.body).toHaveProperty('updatedAt')
    expect(res.body.email).toBe('test@test.com')
    expect(res.body.role).toBe('user')
    expect(res.body).not.toHaveProperty('password')
    expect(res.get('authorization')).toMatch(/Bearer /)
  })
  it('should create an admin', async () => {
    const res = await request(app).post('/api/v1/users/signup').send(admin)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('createdAt')
    expect(res.body).toHaveProperty('updatedAt')
    expect(res.body.email).toBe(ADMIN_WHITELIST[0])
    expect(res.body.role).toBe('admin')
    expect(res.body).not.toHaveProperty('password')
    expect(res.get('authorization')).toMatch(/Bearer /)
  })
  it('should return invalid request', async () => {
    const res = await request(app).post('/api/v1/users/signup').send(invalidUser)
    expect(res.status).toBe(400)
  })
  //TODO: ask about this test
  // it('should return Internal Server Error - duplicate email  ', async () => {
  //   const res = await request(app).post('/api/v1/users/signup').send(user)
  //   expect(res.status).toBe(500)
  // })
})
