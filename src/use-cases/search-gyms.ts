import { IGymsRepository } from '@/repositories/gyms-repository/gyms-repository.interface'
import { Gym } from '@prisma/client'

interface SearchGymsDTO {
  query: string
  page?: number
}

interface SearchGymsResponse {
  gyms: Gym[]
}

class SearchGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    query,
    page = 1,
  }: SearchGymsDTO): Promise<SearchGymsResponse> {
    const gyms = await this.gymsRepository.search(query, page)
    return {
      gyms,
    }
  }
}

export { SearchGymsUseCase }
