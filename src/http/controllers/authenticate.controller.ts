import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/repositories/users-repository/prisma/prisma.users.repository'

import { EncryptProvider } from '@/shared/providers/encrypt/encrypt'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentials } from '@/use-cases/errors/user-invalid-credentials'

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  try {
    const { email, password } = authenticateBodySchema.parse(request.body)

    const authenticateUseCase = new AuthenticateUseCase(
      new PrismaUsersRepository(),
      new EncryptProvider(),
    )

    const response = await authenticateUseCase.execute({
      email,
      password,
    })
    return reply.status(200).send(response)
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return reply.status(401).send({
        message: error.message,
      })
    }

    return error
  }
}
