import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function createGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90, {
      message: 'Invalid latitude',
    }),
    longitude: z.number().refine((value) => Math.abs(value) <= 180, {
      message: 'Invalid longitude',
    }),
  })

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
  return reply.status(201).send({
    gym,
  })
}
