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
const user2 = {
  firstName: 'test',
  lastName: 'suite',
  email: 'test2@test.com',
  username: 'testUsername2',
  password: 'testPassword',
}

const credential = {
  username: 'testUsername',
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

let token: string
let userId: string
let anotherUser: string

describe('updateUser route ', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    await request(app).post('/api/v1/users/signup').send(user)
    await request(app).post('/api/v1/users/signup').send(user2)
    const res = await request(app).post('/api/v1/users/signin').send(credential)
    const res2 = await request(app).post('/api/v1/users/signin').send(credential2)
    token = res.get('authorization')
    userId = res.body._id
    anotherUser = res2.body._id
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return updated user ', async () => {
    const res = await request(app).patch(`/api/v1/users/${userId}`).set('authorization', token).send(update)
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
    const res = await request(app).patch(`/api/v1/users/${anotherUser}`).set('authorization', token).send(update)
    expect(res.status).toBe(401)
    expect(res.get('authorization')).toBeUndefined()
  })
  it('should return Invalid Request - missing userId param', async () => {
    const res = await request(app).patch(`/api/v1/users/`).set('authorization', token).send(update)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })
  //TODO: find out why
  // it('should return Forbidden - user is banned', async () => {
  //   await request(app).put(`/api/v1/users/${user.username}`).send({ ban: true })

  //   const res = await request(app).patch(`/api/v1/users/${userId}`).set('authorization', token).send(update)
  //   expect(res.status).toBe(403)
  //   expect(res.get('authorization')).toBeUndefined()
  // })
})
