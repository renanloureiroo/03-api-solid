import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-neraby-gyms'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchNearbyGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchNearbyGymQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90, {
      message: 'Invalid latitude',
    }),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180, {
      message: 'Invalid longitude',
    }),
  })
  try {
    const { latitude, longitude } = fetchNearbyGymQuerySchema.parse(
      request.query,
    )

    const fetchNearbyGymUseCase = makeFetchNearbyGymsUseCase()

    const response = await fetchNearbyGymUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return reply.status(200).send(response)
  } catch (error) {
    return error
  }
}
