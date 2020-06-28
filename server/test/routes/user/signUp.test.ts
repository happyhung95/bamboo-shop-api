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
  lastName: 'admin',
  email: ADMIN_WHITELIST[0],
  username: 'testAdmin',
  password: 'testPassword',
}

const missingEmail = {
  firstName: 'test',
  lastName: 'suite',
  //missing email
  username: 'testUsername',
  password: 'testPassword',
}

describe('signUp route', () => {
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
    expect(res.body.role).toBe('user')
    expect(res.body.email).toBe(user.email)
    expect(res.body).not.toHaveProperty('password')
    expect(res.get('authorization')).toMatch(/Bearer /)
  })

  it('should create an admin', async () => {
    const res = await request(app).post('/api/v1/users/signup').send(admin)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('createdAt')
    expect(res.body).toHaveProperty('updatedAt')
    expect(res.body.role).toBe('admin')
    expect(res.body.email).toBe(admin.email)
    expect(res.body).not.toHaveProperty('password')
    expect(res.get('authorization')).toMatch(/Bearer /)
  })

  it('should return invalid request - missing email', async () => {
    const res = await request(app).post('/api/v1/users/signup').send(missingEmail)
    expect(res.status).toBe(400)
  })

})
