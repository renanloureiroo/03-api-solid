import { FastifyInstance } from 'fastify'
import { registerController } from './controllers/register.controller'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerController)
}
