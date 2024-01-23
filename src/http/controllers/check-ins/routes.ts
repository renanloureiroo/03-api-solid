import { verifyJwt } from '@/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { checkInController } from './check-in.controller'
import { fetchCheckInsHistoryController } from './fetch-check-ins-history.controller'
import { validateCheckInController } from './validate-check-in.controller'
import { getUserMetricsController } from './get-user-metrics.controller'

export const checkInsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/metrics', getUserMetricsController)
  app.get('/check-ins/history', fetchCheckInsHistoryController)

  app.post('/gyms/:gymId/check-ins', checkInController)

  app.patch('/check-ins/:checkInId/validate', validateCheckInController)
}
