import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function createGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.nullable(z.string()),
    phone: z.nullable(z.string()),
    latitude: z.number(),
    longitude: z.number(),
  })
  try {
    const { title, latitude, longitude, description, phone } =
      createGymBodySchema.parse(request.body)

    const registerUseCase = makeCreateGymUseCase()

    const gym = await registerUseCase.execute({
      title,
      latitude,
      longitude,
      description,
      phone,
    })
    return reply.status(201).send(gym)
  } catch (error) {
    return error
  }
}
