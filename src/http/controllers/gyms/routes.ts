import { verifyJwt } from '@/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createGymController } from './create-gym.controller'
import { fetchNearbyGymController } from './fetch-nearby-gym.controller'
import { searchGymController } from './search-gym.controller'
import { verifyUserRole } from '@/middlewares/verify-user-role'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  app.post(
    '/gyms',
    {
      onRequest: [verifyUserRole('ADMIN')],
    },
    createGymController,
  )

  app.get('/gyms/search', searchGymController)
  app.get('/gyms/nearby', fetchNearbyGymController)
}
