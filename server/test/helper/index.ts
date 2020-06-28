import request from 'supertest'
import app from '../../src/app'

import ADMIN_WHITELIST from '../../src/helpers/adminWhitelist'

export const user = {
  firstName: 'test',
  lastName: 'suite',
  email: 'test@test.com',
  username: 'testUsername',
  password: 'testPassword',
}

export const admin = {
  firstName: 'test',
  lastName: 'admin',
  email: ADMIN_WHITELIST[0],
  username: 'testAdmin',
  password: 'testPassword',
}

export const userCredential = {
  username: 'testUsername',
  password: 'testPassword',
}

export const adminCredential = {
  username: 'testAdmin',
  password: 'testPassword',
}

export function createAdmin(override = admin) {
  return request(app).post('/api/v1/users/signup').send(override)
}

export async function getAdmin(override = admin, overrideCredential = adminCredential) {
  await createAdmin(override)
  return request(app).post('/api/v1/users/signin').send(overrideCredential)
}

export async function getAdminToken() {
  const res = await getAdmin()
  return res.get('authorization')
}

export function createUser(override = user) {
    return request(app).post('/api/v1/users/signup').send(override)
}

export async function getUser(override = user, overrideCredential = userCredential) {
  await createUser(override)
  return request(app).post('/api/v1/users/signin').send(overrideCredential)
}

export async function getUserToken() {
  const res = await getUser()
  return res.get('authorization')
}
