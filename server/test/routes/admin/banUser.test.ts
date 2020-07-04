import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import User from '../../../src/models/User'
import { user, admin, getAdminToken, getUserToken } from '../../helper'

const unknownUsername = 'unknownUsername'

let adminToken: string
let userToken: string

describe('changePassword route ', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    adminToken = await getAdminToken()
    userToken = await getUserToken()
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
    const res = await request(app).put('/api/v1/admin/user/ban/').set('authorization', adminToken).send({ ban: true })
    expect(res.status).toBe(404)
  })

  it('should return forbidden - the admin account is banned by another admin', async () => {
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
