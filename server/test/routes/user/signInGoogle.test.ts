import request from 'supertest'

import app from '../../../src/app'
import * as dbHelper from '../../db-helper'
import { user, createUser, userCredential, getAdminToken } from '../../helper'
import { GOOGLE_TOKEN, GOOGLE_TOKEN_EXPIRED } from './../../../src/util/secrets'

// googleToken is fetched manually 
const googleToken = {id_token : GOOGLE_TOKEN}
const googleTokenExpired = {id_token : GOOGLE_TOKEN_EXPIRED}

describe('sign in with google route', () => {
  beforeAll(async () => {
    await dbHelper.connect()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return user and token', async () => {
    const res = await request(app).post('/api/v1/users/signin/google').send(googleToken)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body).not.toHaveProperty('password')
    expect(res.get('authorization')).toMatch(/Bearer /)
  })

  it('should return Unauthorized Request - missing google token', async () => {
    const res = await request(app).post('/api/v1/users/signin/google').send()
    expect(res.status).toBe(401)
    expect(res.get('authorization')).toBeUndefined()
  })

  it('should return Unauthorized Request - google token expired', async () => {
    const res = await request(app).post('/api/v1/users/signin/google').send(googleTokenExpired)
    expect(res.status).toBe(401)
    expect(res.get('authorization')).toBeUndefined()
  })
  
  it('should return Forbidden - account is banned by admin', async () => {
    const userGoogle = await request(app).post('/api/v1/users/signin/google').send(googleToken)
    
    const adminToken = await getAdminToken()
    //ban user
    await request(app)
      .put(`/api/v1/admin/user/ban/${userGoogle.body.username}`)
      .set('authorization', adminToken)
      .send({ ban: true })

    const res = await request(app).post('/api/v1/users/signin/google').send(googleToken)
    expect(res.status).toBe(403)
    expect(res.get('authorization')).toBeUndefined()
  })
  
})
