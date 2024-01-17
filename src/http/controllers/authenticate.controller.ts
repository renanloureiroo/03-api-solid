import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentials } from '@/use-cases/errors/user-invalid-credentials'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

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

    const authenticateUseCase = makeAuthenticateUseCase()

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
