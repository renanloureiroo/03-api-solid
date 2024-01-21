import { PageExtrapolatedTotalPages } from '@/use-cases/errors/page-extrapolated-total-pages'
import { makeFetchCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchCheckInsHistoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCheckInBodySchema = z.object({
    page: z.coerce.number().default(1),
  })

  try {
    const { page } = fetchCheckInBodySchema.parse(request.query)

    const fetchCheckInsHistoryUseCase = makeFetchCheckInsHistoryUseCase()

    const response = await fetchCheckInsHistoryUseCase.execute({
      page,
      userId: 'id_user',
    })

    return reply.status(200).send(response)
  } catch (error) {
    if (error instanceof PageExtrapolatedTotalPages) {
      return reply.status(404).send({
        message: error.message,
      })
    }
    return error
  }
}
