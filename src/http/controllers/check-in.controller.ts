import { MaxDistance } from '@/use-cases/errors/max-distance'
import { MaxNumberOfCheckIns } from '@/use-cases/errors/max-number-of-check-ins'
import { ResourceNotFound } from '@/use-cases/errors/resource-not-found'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function checkInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const checkInBodySchema = z.object({
    gymId: z.string().uuid(),
    userLatitude: z.number(),
    userLongitude: z.number(),
  })

  try {
    const { gymId, userLatitude, userLongitude } = checkInBodySchema.parse(
      request.body,
    )

    const checkInUseCase = makeCheckInUseCase()

    const response = await checkInUseCase.execute({
      gymId,
      userLatitude,
      userLongitude,
      userId: 'id_user',
    })

    return reply.status(201).send(response)
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    if (error instanceof MaxDistance) {
      return reply.status(409).send({
        message: error.message,
      })
    }
    if (error instanceof MaxNumberOfCheckIns) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    return error
  }
}
