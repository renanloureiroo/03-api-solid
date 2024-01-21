import { PrismaCheckInsRepository } from '@/repositories/check-ins-repository/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export const makeValidateCheckInUseCase = () => {
  const checkInRepository = new PrismaCheckInsRepository()
  const validateCheckInUseCase = new ValidateCheckInUseCase(checkInRepository)
  return validateCheckInUseCase
}
