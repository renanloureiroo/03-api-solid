import { CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/check-ins-repostiry/check-ins-repository.interface'

interface CheckInUseCaseDTO {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

class CheckInUseCase {
  constructor(private readonly checkInsRepository: ICheckInsRepository) {}

  async execute({
    gymId,
    userId,
  }: CheckInUseCaseDTO): Promise<CheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}

export { CheckInUseCase }
