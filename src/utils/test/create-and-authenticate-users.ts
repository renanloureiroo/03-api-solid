import { prisma } from '@/lib/prisma'
import { RegisterUseCaseDTO } from '@/use-cases/register'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin?: boolean,
  user: RegisterUseCaseDTO = {
    name: 'John Doe',
    email: 'john_doe@email.com',
    password: '123456',
  },
) {
  await request(app.server).post('/users').send(user)
  if (isAdmin) {
    await prisma.user.update({
      data: {
        role: 'ADMIN',
      },
      where: {
        email: user.email,
      },
    })
  }

  const { body } = await request(app.server).post('/sessions').send({
    email: user.email,
    password: user.password,
  })

  const { token } = body

  return {
    token,
  }
}
