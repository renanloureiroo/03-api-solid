import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-neraby-gyms'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchNearbyGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchNearbyGymQuerySchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
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
