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

describe('forgotPassword route', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    await request(app).post('/api/v1/users/signup').send(user)
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return OK', async () => {
    const res = await request(app).post('/api/v1/users/forgotpassword').send({ email: user.email })
    expect(res.status).toBe(202)
    expect(res.body).toEqual({ message: 'Reset password link sent' })
    expect(res.get('authorization')).toBe('undefined') // value of authorization header: undefined
  })
  it('should return Invalid Request - missing email', async () => {
    const res = await request(app).post('/api/v1/users/forgotpassword').send()
    expect(res.status).toBe(400)
    expect(res.get('authorization')).toBeUndefined()
  })
})
