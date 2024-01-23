import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchGymQuerySchema = z.object({
    query: z.string().default(''),
    page: z.coerce.number().default(1),
  })
  try {
    const { page, query } = searchGymQuerySchema.parse(request.query)

    const searchGymUseCase = makeSearchGymsUseCase()

    const response = await searchGymUseCase.execute({
      query,
      page,
    })

    return reply.status(200).send(response)
  } catch (error) {
    return error
  }
}
