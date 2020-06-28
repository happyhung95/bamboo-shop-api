import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { user, createUser, userCredential, getAdminToken } from '../../helper'

const missingUsername = {
  // missing username
  password: 'testPassword',
}
const falseUsername = {
  username: 'false username',
  password: 'testPassword',
}
const falsePassword = {
  username: 'testUsername',
  password: 'false password',
}

describe('signIn route', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    await createUser()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return user and token', async () => {
    const res = await request(app).post('/api/v1/users/signin').send(userCredential)
    expect(res.status).toBe(201)
    expect(res.body.username).toBe(userCredential.username)
    expect(res.body).not.toHaveProperty('password')
    expect(res.get('authorization')).toMatch(/Bearer /)
  })

  it('should return User Not Found - false password', async () => {
    const res = await request(app).post('/api/v1/users/signin').send(falsePassword)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return User Not Found - false username', async () => {
    const res = await request(app).post('/api/v1/users/signin').send(falseUsername)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return Invalid Request - missing username', async () => {
    const res = await request(app).post('/api/v1/users/signin').send(missingUsername)
    expect(res.status).toBe(400)
    expect(res.get('authorization')).toBeUndefined()
  })
  
  it('should return Forbidden - user is banned', async () => {
    const adminToken = await getAdminToken()

    //ban user
    await request(app)
      .put(`/api/v1/admin/user/ban/${user.username}`)
      .set('authorization', adminToken)
      .send({ ban: true })

    const res = await request(app).post('/api/v1/users/signin').send(userCredential)
    expect(res.status).toBe(403)
    expect(res.get('authorization')).toBeUndefined()
  })
})
