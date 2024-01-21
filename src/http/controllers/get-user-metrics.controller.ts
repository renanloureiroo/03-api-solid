import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getUserMetricsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getUserMetricsUseCase = makeGetUserMetricsUseCase()

    const response = await getUserMetricsUseCase.execute({
      userId: 'user_id',
    })

    return reply.status(200).send(response)
  } catch (error) {
    return error
  }
}
