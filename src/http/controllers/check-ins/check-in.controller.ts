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
  const checkInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const checkInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90, {
      message: 'Invalid latitude',
    }),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180, {
      message: 'Invalid longitude',
    }),
  })

  try {
    const { latitude, longitude } = checkInBodySchema.parse(request.body)
    const { gymId } = checkInParamsSchema.parse(request.params)

    const checkInUseCase = makeCheckInUseCase()

    const response = await checkInUseCase.execute({
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
      userId: request.user.sub,
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
