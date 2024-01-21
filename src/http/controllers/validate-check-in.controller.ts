import { MaxTime } from '@/use-cases/errors/max-time'
import { ResourceNotFound } from '@/use-cases/errors/resource-not-found'
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
    const response = validateCheckInBodySchema.parse(request.body)

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
