import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-users'

describe('Controller: CreateGymController', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able create a new Gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .send({
        title: 'Academia do John',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99999-9999',
        latitude: 40.7128,
        longitude: -74.006,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      gym: expect.objectContaining({
        id: expect.any(String),
        title: 'Academia do John',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99999-9999',
        latitude: '40.7128',
        longitude: '-74.006',
      }),
    })
  })
})
