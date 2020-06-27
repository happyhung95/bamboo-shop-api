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

const update = {
  username: 'testUsername',
  password: 'testPassword',
  newPassword: 'testPassword new',
}
const missingPassword = {
  username: 'testUsername',
  // missing password
  newPassword: 'testPassword new',
}
const falsePassword = {
  username: 'testUsername',
  password: 'false password',
  newPassword: 'testPassword new',
}
const falseUsername = {
  username: 'false username',
  password: 'testPassword',
  newPassword: 'testPassword new',
}

const successMsg = { message: 'Password updated successfully' }

const falseUserId = '5sd4as5fds2f1sef'

let token: string
let userId: string

describe('change password User route ', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    await request(app).post('/api/v1/users/signup').send(user)
    const signInRes = await request(app).post('/api/v1/users/signin').send(credential)
    token = signInRes.get('authorization')
    userId = signInRes.body._id
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return OK', async () => {
    const res = await request(app).put(`/api/v1/users/changepassword/${userId}`).set('authorization', token).send(update)
    expect(res.status).toBe(200)
    expect(res.body).toEqual(successMsg)
    expect(res.get('authorization')).toBeUndefined()
  })
  it('should return Unauthorized Request - false id', async () => {
    const res = await request(app).put(`/api/v1/users/changepassword/${falseUserId}`).set('authorization', token).send(update)
    expect(res.status).toBe(401)
    expect(res.get('authorization')).toBeUndefined()
  })
  it('should return Invalid Request - missing password', async () => {
    const res = await request(app).put(`/api/v1/users/changepassword/${userId}`).set('authorization', token).send(missingPassword)
    expect(res.status).toBe(400)
    expect(res.get('authorization')).toBeUndefined()
  })
  it('should return User Not Found - false password', async () => {
    const res = await request(app).put(`/api/v1/users/changepassword/${userId}`).set('authorization', token).send(falsePassword)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })
  it('should return User Not Found - false username', async () => {
    const res = await request(app).put(`/api/v1/users/changepassword/${userId}`).set('authorization', token).send(falseUsername)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })
})