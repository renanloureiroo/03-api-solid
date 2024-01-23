import { RegisterUseCaseDTO } from '@/use-cases/register'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  user: RegisterUseCaseDTO = {
    name: 'John Doe',
    email: 'john_doe@email.com',
    password: '123456',
  },
) {
  await request(app.server).post('/users').send(user)

  const { body } = await request(app.server).post('/sessions').send({
    email: user.email,
    password: user.password,
  })

  const { token } = body

  return {
    token,
  }
}
