import { FastifyReply, FastifyRequest } from 'fastify'

export async function refreshController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({
    onlyCookie: true,
  })

  try {
    const token = await reply.jwtSign(
      {
        role: request.user.role,
      },
      {
        sign: {
          sub: request.user.sub,
        },
      },
    )
    const refreshToken = await reply.jwtSign(
      { role: request.user.role },
      {
        sign: {
          sub: request.user.sub,
        },
      },
    )

    return reply

      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({
        token,
      })
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(401).send({
        message: error.message,
      })
    }

    return error
  }
}
