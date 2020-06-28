import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { user, createUser } from '../../helper'


describe('forgotPassword route', () => {
  beforeAll(async () => {
    await dbHelper.connect()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
    await createUser()
  })

  it('should return OK', async () => {
    const res = await request(app).post('/api/v1/users/forgotpassword').send({ email: user.email })
    expect(res.status).toBe(202)
    expect(res.body).toEqual({ message: 'Reset password link sent' })
    expect(res.get('authorization')).toBeUndefined() 
  })
  it('should return Invalid Request - missing email', async () => {
    const res = await request(app).post('/api/v1/users/forgotpassword').send()
    expect(res.status).toBe(400)
    expect(res.get('authorization')).toBeUndefined()
  })
})
