import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'

const user = {
  firstName: 'test',
  lastName: 'suite',
  email: 'test@test.com',
  username: 'testUsername',
  password: 'testPassword',
}

const credential = {
  username: 'testUsername',
  password: 'testPassword',
}

const falseUserId = '5sd4as5fds2f1sef'

let userId: string

describe('getUser route ', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    await request(app).post('/api/v1/users/signup').send(user)
    const signInRes = await request(app).post('/api/v1/users/signin').send(credential)
    userId = signInRes.body._id
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return an user', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`)
    expect(res.status).toBe(200)
    expect(res.body).not.toHaveProperty('password')
    expect(res.body._id).toBe(userId)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return User Not Found - false id', async () => {
    const res = await request(app).get(`/api/v1/users/${falseUserId}`)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })
})
