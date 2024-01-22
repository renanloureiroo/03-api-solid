import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Controller-e2e: ProfileController', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    })

    const { body } = await request(app.server).post('/sessions').send({
      email: 'john_doe@email.com',
      password: '123456',
    })

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${body.token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      }),
    })
  })
})
