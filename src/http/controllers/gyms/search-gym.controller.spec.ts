import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-users'
import { app } from '@/app'

let userAdmin: {
  token: string
}
let userMember: {
  token: string
}

describe('Controllers: SearchGymController', () => {
  beforeAll(async () => {
    await app.ready()
    userAdmin = await createAndAuthenticateUser(app, true)
    userMember = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms', async () => {
    await request(app.server)
      .post('/gyms')
      .send({
        title: 'Academia do John',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99999-9999',
        latitude: 40.7128,
        longitude: -74.006,
      })
      .set('Authorization', `Bearer ${userAdmin.token}`)

    await request(app.server)
      .post('/gyms')
      .send({
        title: 'Academia da Maria',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99888-8888',
        latitude: 39.4333529,
        longitude: -76.6375209,
      })
      .set('Authorization', `Bearer ${userAdmin.token}`)

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'John',
      })
      .set('Authorization', `Bearer ${userMember.token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
  })

  it('should be able return empty list', async () => {
    await request(app.server)
      .post('/gyms')
      .send({
        title: 'Academia do John',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99999-9999',
        latitude: 40.7128,
        longitude: -74.006,
      })
      .set('Authorization', `Bearer ${userAdmin.token}`)

    await request(app.server)
      .post('/gyms')
      .send({
        title: 'Academia da Maria',
        description: 'Academia do John Doe, a melhor academia do mundo',
        phone: '55 27 99888-8888',
        latitude: 39.4333529,
        longitude: -76.6375209,
      })
      .set('Authorization', `Bearer ${userAdmin.token}`)

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'José',
      })
      .set('Authorization', `Bearer ${userMember.token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(0)
  })
})
