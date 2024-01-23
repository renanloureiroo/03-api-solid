import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { userMapper } from '@/use-cases/mappers/user-mapper'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify()

  const getUserProfile = makeGetUserProfileUseCase()

  const profile = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: userMapper(profile.user),
  })
}
