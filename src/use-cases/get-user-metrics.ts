import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'

interface GetUserMetricsDTO {
  userId: string
}

class GetUserMetricsUseCase {
  constructor(private readonly checkInRepository: ICheckInsRepository) {}

  async execute({ userId }: GetUserMetricsDTO) {
    const totalCheckIns = await this.checkInRepository.countByUserId(userId)

    return {
      totalCheckIns,
    }
  }
}

export { GetUserMetricsUseCase }
