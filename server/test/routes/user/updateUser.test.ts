import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { user, getUser, getAdminToken } from '../../helper'

const user2 = {
  firstName: 'test',
  lastName: 'suite',
  email: 'test2@test.com',
  username: 'testUsername2',
  password: 'testPassword',
}

const credential2 = {
  username: 'testUsername2',
  password: 'testPassword',
}

const update = {
  firstName: 'test update',
  lastName: 'suite update',
  username: 'username update',
}

let userToken: string
let userId: string
let anotherUser: string

describe('updateUser route ', () => {
  beforeEach(async () => {
    await dbHelper.connect()
    const User1 = await getUser()
    const User2 = await getUser(user2, credential2)
    userToken = User1.get('authorization')
    userId = User1.body._id
    anotherUser = User2.body._id
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return updated user ', async () => {
    const res = await request(app).patch(`/api/v1/users/${userId}`).set('authorization', userToken).send(update)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject(update)
    expect(res.body).not.toHaveProperty('password')
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return Unauthorized Request - missing token', async () => {
    const res = await request(app).patch(`/api/v1/users/${userId}`).send(update)
    expect(res.status).toBe(401)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return Unauthorized Request - update another user', async () => {
    const res = await request(app).patch(`/api/v1/users/${anotherUser}`).set('authorization', userToken).send(update)
    expect(res.status).toBe(401)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return Invalid Request - missing userId param', async () => {
    const res = await request(app).patch('/api/v1/users/').set('authorization', userToken).send(update)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return Forbidden - user is banned', async () => {
    const adminToken = await getAdminToken()

    //ban user
    await request(app)
      .put(`/api/v1/admin/user/ban/${user.username}`)
      .set('authorization', adminToken)
      .send({ ban: true })
    
    const res = await request(app).patch(`/api/v1/users/${userId}`).set('authorization', userToken).send(update)
    expect(res.status).toBe(403)
    expect(res.get('authorization')).toBeUndefined()
  })
})
