import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-users'

describe('Controllers, CheckInController', () => {
  beforeAll(async () => {
    await app.ready()

    vi.useFakeTimers()
  })

  afterAll(async () => {
    await app.close()

    vi.useRealTimers()
  })

  it('should be able to return check-ins history', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const userAdmin = await createAndAuthenticateUser(app, true)

    const createGymResponse = await request(app.server)
      .post('/gyms')
      .send({
        title: 'Academia do John',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99999-9999',
        latitude: 40.7128,
        longitude: -74.006,
      })
      .set('Authorization', `Bearer ${userAdmin.token}`)

    for (let i = 1; i < 6; i++) {
      vi.setSystemTime(new Date(2024, 0, i, 4, 18, 0))
      await request(app.server)
        .post(`/gyms/${createGymResponse.body.gym.id}/check-ins`)
        .send({
          latitude: 40.7128,
          longitude: -74.006,
        })
        .set('Authorization', `Bearer ${token}`)
    }

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toHaveLength(5)
    expect(response.body).toEqual(
      expect.objectContaining({
        checkIns: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            gym_id: createGymResponse.body.gym.id,
          }),
        ]),
      }),
    )
  })
})
