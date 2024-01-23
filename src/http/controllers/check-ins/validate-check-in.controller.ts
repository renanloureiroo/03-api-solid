import { MaxTime } from '@/use-cases/errors/max-time'
import { ResourceNotFound } from '@/use-cases/errors/resource-not-found'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validateCheckInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validateCheckInBodySchema = z.object({
    checkInId: z.string(),
  })

  try {
    const { checkInId } = validateCheckInBodySchema.parse(request.params)

    const validateCheckInUseCase = makeValidateCheckInUseCase()

    const response = await validateCheckInUseCase.execute({
      checkInId,
    })

    return reply.status(200).send(response)
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.status(400).send({
        message: error.message,
      })
    }

    if (error instanceof MaxTime) {
      return reply.status(400).send({
        message: error.message,
      })
    }

    return error
  }
}
