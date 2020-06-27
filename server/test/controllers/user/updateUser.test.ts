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
  firstName: 'test update',
  lastName: 'suite update',
  username: 'username update',
}

let token: string
let userId: string

describe('update User route ', () => {
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

  it('should return updated user ', async () => {
    const res = await request(app).post(`/api/v1/users/${userId}`).set('authorization', token).send(update)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject(update)
    expect(res.body).not.toHaveProperty('password')
    expect(res.get('authorization')).toBeUndefined()
  })
  // it('should return Invalid Request', async () => {
  //   const res = await request(app).post('/api/v1/users/signin').send(update)
  //   expect(res.status).toBe(401)
  //   expect(res.get('authorization')).toBeUndefined()
  // })
})
