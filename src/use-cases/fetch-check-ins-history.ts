import { ICheckInsRepository } from '@/repositories/check-ins-repository/check-ins-repository.interface'
import { PageExtrapolatedTotalPages } from './errors/page-extrapolated-total-pages'

interface FetchCheckInsHistoryDTO {
  userId: string
  page?: number
}

class FetchCheckInsHistoryUseCase {
  constructor(private readonly checkInRepository: ICheckInsRepository) {
    this.checkInRepository = checkInRepository
  }

  async execute({ userId, page = 1 }: FetchCheckInsHistoryDTO) {
    const totalItens = await this.checkInRepository.countByUserId(userId)
    const totalPages = Math.ceil(totalItens / 20)

    if (page > totalPages) {
      throw new PageExtrapolatedTotalPages()
    }

    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return {
      checkIns,
      pages: totalPages,
    }
  }
}

export { FetchCheckInsHistoryUseCase }
