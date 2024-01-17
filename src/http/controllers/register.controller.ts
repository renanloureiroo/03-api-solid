import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/users-repository/prisma/prisma.users.repository'
import { UserAlreadyExists } from '@/use-cases/errors/user-already-exists'

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  try {
    const { name, email, password } = registerBodySchema.parse(request.body)

    const registerUseCase = new RegisterUseCase(new PrismaUsersRepository())

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    return error
  }

  return reply.status(201).send()
}
