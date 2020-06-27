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
const falseCredential = {
  username: 'testUsername',
  password: 'false password',
}

describe('signIn route', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    await request(app).post('/api/v1/users/signup').send(user)
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return user and token', async () => {
    const res = await request(app).post('/api/v1/users/signin').send(credential)
    expect(res.status).toBe(201)
    expect(res.body.username).toBe(credential.username)
    expect(res.body).not.toHaveProperty('password')
    expect(res.get('authorization')).toMatch(/Bearer /)
  })
  it('should return User Not Found', async () => {
    const res = await request(app).post('/api/v1/users/signin').send(falseCredential)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })

})

