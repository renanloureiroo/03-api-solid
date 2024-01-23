import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-users'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Controllers: ValidateCheckInController', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to validate check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gymUser = await createAndAuthenticateUser(app, true, {
      name: 'John Doe Gym',
      email: 'johndoe_gym@email.com',
      password: '123456',
    })

    const createGymResponse = await request(app.server)
      .post('/gyms')
      .send({
        title: 'Academia do John',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99999-9999',
        latitude: 40.7128,
        longitude: -74.006,
      })
      .set('Authorization', `Bearer ${gymUser.token}`)

    const checkInResponse = await request(app.server)
      .post(`/gyms/${createGymResponse.body.gym.id}/check-ins`)
      .send({
        latitude: 40.7128,
        longitude: -74.006,
      })
      .set('Authorization', `Bearer ${token}`)

    const response = await request(app.server)
      .patch(`/check-ins/${checkInResponse.body.checkIn.id}/validate`)
      .set('Authorization', `Bearer ${gymUser.token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      checkIn: expect.objectContaining({
        id: expect.any(String),
        validated_at: expect.any(String),
      }),
    })
  })
})
