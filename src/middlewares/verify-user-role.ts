import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(role: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user.role

    if (userRole !== role) {
      return reply.status(401).send({
        message: 'Unauthorized',
      })
    }
  }
}
