import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { getUser } from '../../helper'



const falseUserId = '5sd4as5fds2f1sef'

let userId: string

describe('getUser route ', () => {
  beforeAll(async () => {
    await dbHelper.connect()
    const User = await getUser()
    userId = User.body._id
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return an user', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`)
    expect(res.status).toBe(200)
    expect(res.body).not.toHaveProperty('password')
    expect(res.body._id).toBe(userId)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return User Not Found - false id', async () => {
    const res = await request(app).get(`/api/v1/users/${falseUserId}`)
    expect(res.status).toBe(404)
    expect(res.get('authorization')).toBeUndefined()
  })
})
