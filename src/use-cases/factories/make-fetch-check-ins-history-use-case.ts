import { PrismaCheckInsRepository } from '@/repositories/check-ins-repository/prisma/prisma-check-ins-repository'
import { FetchCheckInsHistoryUseCase } from '../fetch-check-ins-history'

export function makeFetchCheckInsHistoryUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const fetchCheckInsHistoryUseCase = new FetchCheckInsHistoryUseCase(
    checkInRepository,
  )

  return fetchCheckInsHistoryUseCase
}
