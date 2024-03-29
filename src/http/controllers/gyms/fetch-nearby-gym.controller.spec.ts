import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-users'
import { app } from '@/app'

describe('Controller: FetchNearbyGymController', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const userMember = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .send({
        title: 'Academia do John',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99999-9999',
        latitude: 40.7128,
        longitude: -74.006,
      })
      .set('Authorization', `Bearer ${token}`)

    await request(app.server)
      .post('/gyms')
      .send({
        title: 'Academia do John2',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99888-8888',
        latitude: 39.4333529,
        longitude: -76.6375209,
      })
      .set('Authorization', `Bearer ${token}`)

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: 40.7234482,
        longitude: -74.0075681,
      })
      .set('Authorization', `Bearer ${userMember.token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
  })
})
