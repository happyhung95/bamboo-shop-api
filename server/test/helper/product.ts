import request from 'supertest'

import app from '../../src/app'
import { getAdminToken } from './index'

export const product = {
  id: 1,
  name: 'Light bamboo bag',
  manufacturer: 'Vietnam',
  variants: [
    {
      inStock: 100,
      price: 19.9,
      size: 'S',
      color: 'light',
    },
  ],
  category: ['bag'],
}

export async function createProduct(override = product) {
  const adminToken = await getAdminToken()
  return request(app).post('/api/v1/admin/product').set('authorization', adminToken).send(override)
}

function* categoryGenerator() {
  while (true) yield* ['bag', 'hat', 'rucksack', 'bowl', 'spoon']
}

function* quantityGenerator() {
  while (true) yield* [0, 100]
}

function* manufacturerGenerator() {
  while (true) yield* ['Vietnam Eco Ltd', 'Thailand Bamboo Ltd', 'China Ltd']
}

function* sizeGenerator() {
  while (true) yield* ['S', 'M', 'L']
}

function* colorGenerator() {
  while (true) yield* ['red', 'yellow', 'pink', 'blue', 'orange', 'white', 'black']
}

export async function generateProducts(num: number) {
  const catGen = categoryGenerator()
  const numGen = quantityGenerator()
  const originGen = manufacturerGenerator()
  const sizeGen = sizeGenerator()
  const colorGen = colorGenerator()
  for (let i = 1; i < num + 1; i++) {
    const category = catGen.next().value as string
    const inStock = numGen.next().value as number
    const manufacturer = originGen.next().value as string
    const size = sizeGen.next().value as string
    const color = colorGen.next().value as string
    await createProduct({
      id: i,
      category: [category],
      name: `bamboo ${category} ${i}`,
      manufacturer,
      variants: [{ price: 100, color, inStock, size }],
    })
  }
}
