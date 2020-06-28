import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import ADMIN_WHITELIST from '../../../src/helpers/adminWhitelist'
import User from '../../../src/models/User'

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

const userCred = {
  username: 'testUsername',
  password: 'testPassword',
}

const adminCred = {
  username: 'testAdmin',
  password: 'testPassword',
}

const unknownUsername = 'unknownUsername'

let adminToken: string
let userToken: string

describe('changePassword route ', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    await request(app).post('/api/v1/users/signup').send(admin)
    await request(app).post('/api/v1/users/signup').send(user)
    const res = await request(app).post('/api/v1/users/signin').send(adminCred)
    const res2 = await request(app).post('/api/v1/users/signin').send(userCred)
    adminToken = res.get('authorization')
    userToken = res2.get('authorization')
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return OK', async () => {
    const res = await request(app)
      .put(`/api/v1/admin/user/ban/${user.username}`)
      .set('authorization', adminToken)
      .send({ ban: true })
    const bannedUser = await User.findOne({ username: user.username }).exec()
    expect(res.status).toBe(204)
    expect(bannedUser!.active).toBe(false)
    expect(res.body).toStrictEqual({})
  })

  it('should return Unauthorized Request - missing token', async () => {
    const res = await request(app).put(`/api/v1/admin/user/ban/${user.username}`).send({ ban: true })
    expect(res.status).toBe(401)
  })

  it('should return Unauthorized Request - user token', async () => {
    const res = await request(app)
      .put(`/api/v1/admin/user/ban/${user.username}`)
      .set('authorization', userToken)
      .send({ ban: true })
    expect(res.status).toBe(401)
  })

  it('should return User not found - unknown username', async () => {
    const res = await request(app)
      .put(`/api/v1/admin/user/ban/${unknownUsername}`)
      .set('authorization', adminToken)
      .send({ ban: true })
    expect(res.status).toBe(404)
  })

  it('should return Cannot find route - missing username', async () => {
    const res = await request(app).put(`/api/v1/admin/user/ban/`).set('authorization', adminToken).send({ ban: true })
    expect(res.status).toBe(404)
  })

  it('should return forbidden - missing username', async () => {
    await request(app)
      .put(`/api/v1/admin/user/ban/${admin.username}`)
      .set('authorization', adminToken)
      .send({ ban: true })
    const res = await request(app)
      .put(`/api/v1/admin/user/ban/${user.username}`)
      .set('authorization', adminToken)
      .send()
    expect(res.status).toBe(403)
  })
})
