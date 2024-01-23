import { verifyJwt } from '@/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createGymController } from './create-gym.controller'
import { fetchNearbyGymController } from './fetch-nearby-gym.controller'
import { searchGymController } from './search-gym.controller'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', createGymController)

  app.get('/gyms/search', searchGymController)
  app.get('/gyms/nearby', fetchNearbyGymController)
}
