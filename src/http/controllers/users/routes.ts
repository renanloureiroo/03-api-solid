import { FastifyInstance } from 'fastify'
import { registerController } from './register.controller'
import { authenticateController } from './authenticate.controller'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { profileController } from './profile.controller'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerController)

  app.post('/sessions', authenticateController)

  app.get(
    '/me',
    {
      onRequest: [verifyJwt],
    },
    profileController,
  )
}
