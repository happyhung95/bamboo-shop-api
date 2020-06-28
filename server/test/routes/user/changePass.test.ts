import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { user, getAdmin, getUser } from '../../helper'

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

let adminToken: string
let userToken: string
let userId: string

describe('changePassword route ', () => {
  beforeEach(async () => {
    await dbHelper.connect()
    const admin = await getAdmin()
    const user = await getUser()
    adminToken = admin.get('authorization')
    userToken = user.get('authorization')
    userId = user.body._id
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return OK', async () => {
    const res = await request(app).put(`/api/v1/users/changepassword/`).set('authorization', userToken).send(update)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: 'Password updated successfully' })
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return Invalid Request - missing password', async () => {
    const res = await request(app)
      .put(`/api/v1/users/changepassword/`)
      .set('authorization', userToken)
      .send(missingPassword)
    expect(res.status).toBe(400)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return User Not Found - false password', async () => {
    const res = await request(app)
      .put(`/api/v1/users/changepassword/`)
      .set('authorization', userToken)
      .send(falsePassword)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return User Not Found - false username', async () => {
    const res = await request(app)
      .put(`/api/v1/users/changepassword/`)
      .set('authorization', userToken)
      .send(falseUsername)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return Forbidden - user is banned', async () => {
    //ban user
    await request(app)
      .put(`/api/v1/admin/user/ban/${user.username}`)
      .set('authorization', adminToken)
      .send({ ban: true })

    const res = await request(app).put(`/api/v1/users/changepassword/`).set('authorization', userToken).send(update)

    expect(res.status).toBe(403)
    expect(res.get('authorization')).toBeUndefined()
  })
})
