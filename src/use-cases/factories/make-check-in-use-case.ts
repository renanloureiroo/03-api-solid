import { PrismaCheckInsRepository } from '@/repositories/check-ins-repository/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/gyms-repository/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in-use-case'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()

  const checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return checkInUseCase
}
